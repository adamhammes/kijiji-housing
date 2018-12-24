import { formatRooms } from "../lib/utils";

const genPopupContent = (offer, ad_type) => `
  <div>
    <h3>
      <a
        target="_blank"
        href=${offer.url}
      >
        ${offer.headline}
      </a>
    </h3>
    <p>
      <strong>
        ${offer.formattedPrice}
        ${ad_type.id === "rent" ? ` | ${formatRooms(offer.num_rooms)}` : ""}
      </strong>
    </p>
    <p>
      ${offer.description}
    </p>
  </div>
`;

export default genPopupContent;
