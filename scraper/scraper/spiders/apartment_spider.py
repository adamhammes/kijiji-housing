import datetime
import logging
import sys

import scrapy
from scraper.items import Apartment
from scrapy.loader import ItemLoader
from scrapy.utils.log import configure_logging
from ..cities import load_start_config, generate_starting_points

configure_logging(install_root_handler=False)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(message)s",
    handlers=[
        logging.FileHandler("log.txt", mode="w"),
        logging.StreamHandler(sys.stdout),
    ],
)


class ApartmentSpider(scrapy.Spider):
    base_url = "https://www.kijiji.ca"
    name = "apartments"
    version = 2

    num_results_pages = 1

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        try:
            if self.full_scrape:
                logging.debug("Running full scrape")
            else:
                logging.debug("Only scraping first page of results")
        except AttributeError:
            logging.debug(
                'Command-line arg "full_scrape" not found\n'
                "defaulting to only using first page of results"
            )
            self.full_scrape = False

    def start_requests(self):
        start_config = load_start_config()
        for starting_point in generate_starting_points(start_config):
            logging.debug(starting_point)
            yield scrapy.Request(
                url=starting_point.url,
                callback=self.results_page,
                meta={"origin": starting_point, "dont_cache": True},
            )

    def results_page(self, response):
        logging.debug(f"results page {self.num_results_pages}")
        self.num_results_pages += 1
        apartment_paths = response.css(".info-container a.title::attr(href)").extract()

        if not self.full_scrape:
            apartment_paths = [apartment_paths[0]]

        for path in apartment_paths:
            full_url = ApartmentSpider.base_url + path
            meta_with_cache = {**response.meta, "dont_cache": False}
            yield scrapy.Request(
                url=full_url, callback=self.apartment_page, meta=meta_with_cache
            )

        next_path = response.css('[title~="Suivante"]::attr(href)').extract_first()

        if next_path and self.full_scrape:
            next_url = ApartmentSpider.base_url + next_path
            yield scrapy.Request(
                url=next_url, callback=self.results_page, meta=response.meta
            )

    def apartment_page(self, response):
        l = ItemLoader(item=Apartment(), response=response)
        l.default_output_processor = scrapy.loader.processors.TakeFirst()

        l.add_value("origin", [response.meta["origin"]])
        l.add_value("url", response.request.url)
        l.add_css("main_image_url", 'meta[property~="og:image"]::attr(content)')
        l.add_css("headline", "h1[class^='title']::text")
        l.add_css("description", 'div[class^="descriptionContainer"] > div')
        l.add_css("title", "title::text")
        l.add_value("date_accessed", datetime.datetime.now())

        l.add_css("raw_id", '[class^="adId"]::text')
        l.add_css("date", 'div[class^="datePosted"] > time::attr(datetime)')
        l.add_css("raw_address", "span[class^='address']::text")
        l.add_css("raw_price", 'span[class^="currentPrice"] > span::text')

        attribute_query = "dt:contains('{}') + dd::text"
        l.add_css("raw_rooms", attribute_query.format("Pièces"))
        l.add_css("raw_bathrooms", attribute_query.format("Salles de bain"))
        l.add_css("raw_animals", attribute_query.format("Animaux"))
        l.add_css("raw_furnished", attribute_query.format("Meublé"))

        return l.load_item()
