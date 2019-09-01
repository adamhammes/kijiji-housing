from datetime import datetime
import fractions
import logging
import re

from scrapy.exceptions import DropItem
from scraper.items import Apartment


FIELD_NAMES = Apartment.fields.keys()

REQUIRED_FIELDS = ["raw_id", "raw_address"]


class ValidationPipeline(object):
    def open_spider(self, spider):
        self.cache = set()

    def process_item(self, item, spider):
        for field in REQUIRED_FIELDS:
            if not field in item:
                raise DropItem(f"Missing required field {field} in {item['url']}")

        if item["raw_id"] in self.cache:
            raise DropItem("Already seen item (link: {})".format(item["url"]))

        if item["raw_address"].startswith(","):
            logging.info(f"Address for {item['url']} is not precise")

        self.cache.add(item["raw_id"])

        # Set all missing fields to None
        for key in FIELD_NAMES:
            item.setdefault(key, None)

        item["id"] = int(item["raw_id"])
        item["price"] = _read_price(item["raw_price"])

        if item["origin"].ad_type.id in ["rent"]:
            item["num_rooms"] = _read_num_rooms(item["raw_rooms"])

        if item["origin"].ad_type.id in ["rent", "colocation"]:
            item["is_furnished"] = _read_furnished(item["raw_furnished"])
            item["allows_animals"] = _read_animals(item["raw_animals"])

        if item["origin"].ad_type.id in ["rent", "buy"]:
            item["num_bathrooms"] = _read_bathrooms(item["raw_bathrooms"])

        return item


def nullable(func, *args, **kw):
    def wrapped(*args, **kw):
        if args[0] is None:
            return None

        return func(*args, **kw)

    return wrapped


@nullable
def _read_price(raw_price):
    valid_chars = "0123456789,"
    valid_price = "".join(c for c in raw_price if c in valid_chars)

    price_re = re.compile(r"(\d+),(\d+)")
    match = price_re.search(valid_price)

    if not match:
        raise DropItem('Couldn\'t read price "{}"'.format(raw_price))

    dollars = int(match.group(1))
    cents = int(match.group(2))

    return dollars * 100 + cents


@nullable
def _read_bathrooms(raw_bathrooms):
    bathroom_re = re.compile(r"(\d+)(,5)?")
    match = bathroom_re.search(raw_bathrooms)

    if not match:
        raise DropItem('Couldn\'t read bathrooms "{}"'.format(raw_bathrooms))

    val = float(match.group(1))
    if match.group(2) == ",5":
        val += 0.5

    return val


@nullable
def _read_furnished(raw_furnished):
    return "Oui" in raw_furnished


@nullable
def _read_animals(raw_animals):
    return "Oui" in raw_animals


@nullable
def _read_num_rooms(raw_fraction):
    raw_fraction = raw_fraction.replace("½", "1/2")
    parts = raw_fraction.split(" ")[:2]

    return float(sum(fractions.Fraction(part) for part in parts))
