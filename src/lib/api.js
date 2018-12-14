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

module.exports = {
  objectFromIterable,
  whitelistOffer,
};
