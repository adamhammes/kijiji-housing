import csv
from datetime import date, datetime, timezone
import io
import json
import logging
import os

import boto3
from twilio.rest import Client as TwilioClient

from scraper.items import Apartment
from ..cities import load_start_config, AdType, City, StartingPoint


EXPORT_TIME = None
FIELD_NAMES = list(Apartment.fields.keys())
OUTPUT_DIRECTORY = os.environ["KIJIJI_OUTPUT_DIRECTORY"]
LATEST_DIRECTORY = os.path.join(OUTPUT_DIRECTORY, "latest")
TWILIO_SID = os.environ["TWILIO_SID"]
TWILIO_AUTH_TOKEN = os.environ["TWILIO_AUTH_TOKEN"]
TWILIO_FROM = os.environ["TWILIO_NUMBER"]
TWILIO_TO = os.environ["PHONE_NUMBER"]


class ItemCollector:
    def __init__(self, stats):
        self.stats = stats

    @classmethod
    def from_crawler(cls, crawler):
        return cls(crawler.stats)

    def open_spider(self, spider):
        self.version = spider.version
        self.full_scrape = spider.full_scrape

        config = load_start_config()

        self.cities = config["cities"]
        self.ad_types = config["ad_types"]

        city_dicts = list(map(lambda c: c._asdict(), self.cities))
        ad_dicts = list(map(lambda a: a._asdict(), self.ad_types))

        self.export_data = {
            "cities": city_dicts,
            "ad_types": ad_dicts,
            "date_collected": datetime_slug(),
            "data_version": self.version,
            "offers": {},
        }

        for city in self.cities:
            self.export_data["offers"][city.id] = {}

            for ad_type in self.ad_types:
                self.export_data["offers"][city.id][ad_type.id] = []

        logging.debug(self.export_data)

    def process_item(self, item, _):
        city = item["origin"].city
        ad_type = item["origin"].ad_type

        item["origin"] = item["origin"].normalized()

        self.export_data["offers"][city.id][ad_type.id].append(item)
        return item

    def close_spider(self, _):
        data = to_json(self.export_data)

        num_scraped = self.stats.get_value("item_scraped_count") or 1
        num_dropped = self.stats.get_value("item_dropped_count") or 0
        num_errors = self.stats.get_value("log_count/ERROR") or 0

        bad_scrape = problem_with_scrape(
            self.full_scrape, num_scraped, num_dropped, num_errors
        )

        if self.full_scrape and bad_scrape:
            logging.info("Detecting problem with scrape, sending text message")
            client = TwilioClient(TWILIO_SID, TWILIO_AUTH_TOKEN)
            body = "Problem with Kijiji scrape: " + bad_scrape
            client.messages.create(to=TWILIO_TO, from_=TWILIO_FROM, body=body)
            return

        export(data, "out.json", self.full_scrape, self.version)


def export(value, exporter_name, full_scrape, version):
    latest_path = os.path.join(LATEST_DIRECTORY, exporter_name)
    os.makedirs(os.path.dirname(latest_path), exist_ok=True)
    with io.open(latest_path, "w", encoding="utf-8") as f:
        f.write(value)

    time_path = os.path.join(datetime_slug(), exporter_name)
    latest_path = os.path.join("latest", exporter_name)

    if full_scrape:
        upload_to_s3(time_path, value, version)
        upload_to_s3(latest_path, value, version)

    file_time_path = os.path.join(OUTPUT_DIRECTORY, time_path)
    os.makedirs(os.path.dirname(file_time_path), exist_ok=True)
    with io.open(file_time_path, "w", encoding="utf-8") as f:
        f.write(value)


def datetime_slug():
    global EXPORT_TIME

    if EXPORT_TIME is None:
        now = datetime.now(timezone.utc)
        EXPORT_TIME = now.strftime("%Y%m%dT%H%M%SZ")

    return EXPORT_TIME


def normalize_origin(item):
    origin = item["origin"]

    normalized_origin = {
        "url": origin.url,
        "city_id": origin.city.id,
        "ad_type_id": origin.ad_type.id,
    }

    item["origin"] = normalized_origin

    return item


def upload_to_s3(dir, string, version):
    # For the following line of code to work, the following environment
    # variables need to be set:
    #
    # os.environ['AWS_ACCESS_KEY_ID']
    # os.environ['AWS_SECRET_ACCESS_KEY']
    s3 = boto3.resource("s3", region_name="us-east-2")
    bucket = s3.Bucket("kijiji-apartments")

    base_path = "v" + str(version)
    path = "{}/{}".format(base_path, dir)

    logging.debug("s3path")
    logging.debug(path)
    logging.debug(version)

    bucket.put_object(Key=path, Body=string.encode("utf-8"))


def full_csv(_, items):
    file_like = io.StringIO()
    csv_writer = csv.DictWriter(file_like, fieldnames=FIELD_NAMES)

    csv_writer.writeheader()
    for item in items:
        csv_writer.writerow(item)

    return file_like.getvalue()


def to_json(data):
    return json.dumps(data, default=_json_serial)


def _json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()

    if isinstance(obj, (Apartment)):
        return dict(obj)

    if isinstance(obj, (City, AdType, StartingPoint)):
        return obj._asdict()

    import pdb

    pdb.set_trace()

    raise TypeError("Type {} is not serializable".format(type(obj)))


def problem_with_scrape(full_scrape, num_scraped, drop_count, num_errors):
    min_num_offers = 1000
    if full_scrape and num_scraped < min_num_offers:
        return "Scraped less than {} offers".format(min_num_offers)

    if drop_count / num_scraped > 0.2:
        return "Drop rate is too high"

    if num_errors / num_scraped > 0.2:
        return "Error rate is too high"

    return ""
