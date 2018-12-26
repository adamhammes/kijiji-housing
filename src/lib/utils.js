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

let _plogTime = -1;
let _plogLast = -1;
const plog = message => {
  if (typeof window === "undefined") return 0;

  if (_plogTime === -1) {
    _plogTime = Math.round(performance.now());
  }

  const time = Math.round(performance.now());
  const formattedTime = time.toString().padStart(3, " ");
  let deltaMessage = "";
  if (_plogLast !== -1) {
    deltaMessage = ` (+${(time - _plogLast).toString().padStart(3, " ")})`;
  }

  console.debug(`[${formattedTime}${deltaMessage}] ${message}`);
  _plogLast = time;
};

module.exports = { objectFromIterable, formatPrice, formatRooms, plog };
