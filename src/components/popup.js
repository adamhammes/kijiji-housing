import { formatRooms } from "../lib/lib";

const genPopupContent = offer => {
  const parts = [title, byline, description];

  const container = document.createElement("div");

  for (const part of parts) {
    container.appendChild(part(offer));
  }

  return container;
};

const description = offer => {
  const p = document.createElement("p");
  p.innerHTML = offer.description;
  return p;
};

const byline = offer => {
  const bold = document.createElement("b");
  bold.innerText = `${formatRooms(offer.num_rooms)} | ${offer.formattedPrice}`;

  const p = document.createElement("p");
  p.appendChild(bold);

  return p;
};

const title = offer => {
  const anchor = document.createElement("a");
  anchor.setAttribute("target", "_blank");
  anchor.setAttribute("href", offer.url);
  anchor.innerText = offer.headline;

  const h3 = document.createElement("h3");
  h3.appendChild(anchor);
  return h3;
};

export default genPopupContent;
