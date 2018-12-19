const minPriceFilter = (offer, rawMinPrice) => {
  const minPrice = parseInt(rawMinPrice) || 0;

  return offer.price >= minPrice * 100;
};

const maxPriceFilter = (offer, rawMaxPrice) => {
  const maxPrice = parseInt(rawMaxPrice) || 1000000000;
  return offer.price <= maxPrice * 100;
};

const allFilters = [["minPrice", minPriceFilter], ["maxPrice", maxPriceFilter]];

const filterOffers = (offers, filterState) => {
  const applicableFilters = allFilters.filter(
    ([property, _]) => property in filterState
  );

  return offers.filter(offer =>
    applicableFilters.every(([property, filter]) =>
      filter(offer, filterState[property])
    )
  );
};

export default filterOffers;
