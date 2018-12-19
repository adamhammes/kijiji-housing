const minPriceFilter = (offer, filterState) => {
  const minPrice = parseInt(filterState.minPrice) || 0;

  return offer.price >= minPrice * 100;
};

const maxPriceFilter = (offer, filterState) => {
  const maxPrice = parseInt(filterState.maxPrice) || 1000000000;
  return offer.price <= maxPrice * 100;
};

const allFilters = [["minPrice", minPriceFilter], ["maxPrice", maxPriceFilter]];

const filterOffers = (offers, filterState) => {
  const applicableFilters = allFilters
    .filter(([property, _]) => property in filterState)
    .map(([_, filter]) => filter);

  return offers.filter(offer =>
    applicableFilters.every(filter => filter(offer, filterState))
  );
};

export default filterOffers;
