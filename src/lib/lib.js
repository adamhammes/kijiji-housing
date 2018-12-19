const formatter = new Intl.NumberFormat("fr-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 0,
});

const formatPrice = rawPrice => {
  return formatter.format(rawPrice / 100);
};

const formatRooms = raw_rooms => {
  if (raw_rooms === 6.5) {
    return "6 1/2 +";
  }

  const integral = Math.floor(raw_rooms);
  const fractional = raw_rooms - integral === 0 ? "" : " 1/2";

  return `${integral}${fractional}`;
};

export { formatPrice, formatRooms };
