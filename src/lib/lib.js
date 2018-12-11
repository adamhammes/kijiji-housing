const formatPrice = raw_price => {
  const dollars = Math.floor(raw_price / 100);
  const cents = raw_price % 100;
  const padded_cents = cents.toString().padEnd(2, "0");

  return `${dollars},${padded_cents} $`;
};

const formatRooms = raw_rooms => {
  const integral = Math.floor(raw_rooms);
  const fractional = raw_rooms - integral === 0 ? "" : " 1/2";

  return `${integral}${fractional}`;
};

export { formatPrice, formatRooms };
