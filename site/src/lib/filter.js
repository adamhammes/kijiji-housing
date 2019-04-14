const minPriceFilter = (offer, filterState) => {
  const minPrice = parseInt(filterState.minPrice) || 0;

  return offer.price >= minPrice * 100 || offer.price == null;
};

const maxPriceFilter = (offer, filterState) => {
  const maxPrice = parseInt(filterState.maxPrice) || 1000000000;
  return offer.price <= maxPrice * 100 || offer.price == null;
};

const nullPriceFilter = (offer, filterState) => {
  return offer.price != null || filterState.includeNullPrice;
};

const msInDay = 24 * 60 * 60 * 1000;
const timeOnMarketFilter = (offer, filterState) => {
  const maxTimeOnMarket = parseFloat(filterState.timeOnMarket) || 1000;

  const offerDate = new Date(offer.date);
  const offerAgeInDays = (new Date() - offerDate) / msInDay;

  return offerAgeInDays < maxTimeOnMarket;
};

const roomsFilter = (offer, filterState) => {
  const sizes = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5];

  for (let size of sizes) {
    const sizeIsApplicable = filterState[`${size}rooms`];

    if (sizeIsApplicable && offer.num_rooms === size) {
      return true;
    }

    if (sizeIsApplicable && size === 6.5 && offer.num_rooms > size) {
      return true;
    }
  }

  return false;
};

const allFilters = [
  ["minPrice", minPriceFilter],
  ["maxPrice", maxPriceFilter],
  ["1.5rooms", roomsFilter],
  ["timeOnMarket", timeOnMarketFilter],
  ["includeNullPrice", nullPriceFilter],
];

const filterOffers = (offers, filterState) => {
  const applicableFilters = allFilters
    .filter(([property, _]) => property in filterState)
    .map(([_, filter]) => filter);

  return offers.filter(offer =>
    applicableFilters.every(filter => filter(offer, filterState))
  );
};

export default filterOffers;
