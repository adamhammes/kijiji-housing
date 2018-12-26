import { formatRooms } from "../lib/utils";

const genPopupContent = (offer, ad_type) => `
  <div>
    <h4>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href=${offer.url}
      >
        ${offer.headline}
      </a>
    </h4>
    <p>
      <strong>
        ${offer.formattedPrice}
        ${ad_type.id === "rent" ? ` | ${formatRooms(offer.num_rooms)}` : ""}
      </strong>
    </p>
    ${offer.description}
  </div>
`;

export default genPopupContent;
