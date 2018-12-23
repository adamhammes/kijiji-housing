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

const RADIUS_OF_EARTH_KM = 6371;
const radians = degrees => degrees * (Math.PI / 180);

const distanceBetweenKM = (p1, p2) => {
  const [lat1, lon1] = [radians(p1[0]), radians(p1[1])];
  const [lat2, lon2] = [radians(p2[0]), radians(p2[1])];

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return c * RADIUS_OF_EARTH_KM;
};

const withinDistance = (offer, city) => {
  const offerCoords = [offer.latitude, offer.longitude];
  const cityCoords = [city.latitude, city.longitude];

  return distanceBetweenKM(offerCoords, cityCoords) < city.radius;
};

const objectFromIterable = pairs => {
  const toReturn = {};

  pairs.forEach(([key, value]) => (toReturn[key] = value));

  return toReturn;
};

const whitelistOffer = offer => {
  return objectFromIterable(whitelistedKeys.map(key => [key, offer[key]]));
};

const addressIsAccurate = offer =>
  parseInt(offer.address_confidence) >= 9 &&
  offer.address_accuracy === "ROOFTOP";

const splitAndFilter = (rawOffers, city) => {
  let offers = rawOffers.filter(offer => withinDistance(offer, city));
  offers = offers.filter(addressIsAccurate);

  console.log(offers.length + " offers exported");
  const descriptionMapping = objectFromIterable(
    offers.map(offer => [offer.id, offer.description])
  );

  offers = offers.map(whitelistOffer);
  return { descriptionMapping, offers };
};

module.exports = {
  objectFromIterable,
  splitAndFilter,
};
