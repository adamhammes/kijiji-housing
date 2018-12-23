const whitelistedKeys = [
  "url",
  "headline",
  "id",
  "date",
  "price",
  "is_furnished",
  "allows_animals",
  "latitude",
  "longitude",
  "num_rooms",
];

const objectFromIterable = pairs => {
  const toReturn = {};

  pairs.forEach(([key, value]) => (toReturn[key] = value));

  return toReturn;
};

const whitelistOffer = offer => {
  return objectFromIterable(whitelistedKeys.map(key => [key, offer[key]]));
};

const splitAndFilter = rawOffers => {
  const descriptionMapping = objectFromIterable(
    rawOffers.map(offer => [offer.id, offer.description])
  );

  const offers = rawOffers.map(whitelistOffer);

  return { descriptionMapping, offers };
};

module.exports = {
  objectFromIterable,
  splitAndFilter,
};
