const objectFromIterable = pairs => {
  const toReturn = {};

  pairs.forEach(([key, value]) => (toReturn[key] = value));

  return toReturn;
};

const formatter = {
  en: new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
  }),
  fr: new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
  }),
};

const formatPrice = (language, rawPrice) => {
  return formatter[language].format(rawPrice / 100);
};

const formatRooms = raw_rooms => {
  if (raw_rooms === 6.5) {
    return "6 1/2 +";
  }

  const integral = Math.floor(raw_rooms);
  const fractional = raw_rooms - integral === 0 ? "" : " 1/2";

  return `${integral}${fractional}`;
};

module.exports = { objectFromIterable, formatPrice, formatRooms };
