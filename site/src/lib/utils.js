const distanceInWordsToNow = require("date-fns/distance_in_words_to_now");

const fnsEn = require("date-fns/locale/en");
const fnsFr = require("date-fns/locale/fr");

const fnsLocales = {
  en: fnsEn,
  fr: fnsFr,
};

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

const formatPrice = (locale, rawPrice) => {
  if (rawPrice == null) {
    return locale("utils.priceOnRequest");
  }

  return formatter[locale.language].format(rawPrice / 100);
};

const formatRooms = (locale, raw_rooms) => {
  if (raw_rooms === 1.5 || raw_rooms === 2.5) {
    return locale("filters.oneOrTwoAndAHalf");
  }

  if (raw_rooms === 6.5) {
    return "6 ½ +";
  }

  const integral = Math.floor(raw_rooms);
  const fractional = raw_rooms - integral === 0 ? "" : " ½";

  return `${integral}${fractional}`;
};

const timeOnMarketFormatted = (language, rawOfferTime) => {
  const offerDate = new Date(rawOfferTime);
  return distanceInWordsToNow(offerDate, { locale: fnsLocales[language] });
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
  let deltaLocalize = "";
  if (_plogLast !== -1) {
    deltaLocalize = ` (+${(time - _plogLast).toString().padStart(3, " ")})`;
  }

  console.debug(`[${formattedTime}${deltaLocalize}] ${message}`);
  _plogLast = time;
};

module.exports = {
  objectFromIterable,
  formatPrice,
  formatRooms,
  timeOnMarketFormatted,
  plog,
};
