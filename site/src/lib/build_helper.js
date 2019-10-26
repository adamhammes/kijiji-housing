const { objectFromIterable } = require("./utils");

const requiredFields = ["date", "id", "url", "headline"];

const whitelistedCities = [
  "montreal",
  "quebec",
  "sherbrooke",
  "trois-rivieres",
];

const whitelistedKeys = [
  "url",
  "headline",
  "id",
  "date",
  "price",
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

const whitelistOffer = offer => {
  return objectFromIterable(whitelistedKeys.map(key => [key, offer[key]]));
};

const addressIsAccurate = offer =>
  parseInt(offer.address_confidence) >= 9 &&
  offer.address_accuracy === "ROOFTOP";

const hasRequiredFields = offer =>
  requiredFields.every(field => field in offer && offer[field] != null);

const splitAndFilter = (rawOffers, city, ad_type) => {
  let offers = rawOffers.filter(offer => withinDistance(offer, city));
  offers = offers.filter(addressIsAccurate).filter(hasRequiredFields);

  console.log(`${offers.length} offers exported for ${city.id}/${ad_type.id}`);

  const descriptions = offers.map(offer => offer.description);

  offers = offers.map(whitelistOffer);
  const offersWithRooms = offers.filter(offer => Boolean(offer.num_rooms));
  const roomsEnabled = offersWithRooms.length / offers.length > 0.8;
  roomsEnabled
    ? console.log("Enabling rooms filter")
    : console.log(
        `Disabling rooms filter, only ${offersWithRooms.length} of ${
          offers.length
        } have rooms`
      );

  return { descriptions, offers, roomsEnabled };
};

module.exports = {
  splitAndFilter,
  whitelistedCities,
};
