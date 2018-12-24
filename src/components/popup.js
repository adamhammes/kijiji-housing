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
        ${formatRooms(offer.num_rooms)} | 
        ${offer.formattedPrice}
      </strong>
    </p>
    <p>
      ${offer.description}
    </p>
  </div>
`;

export default genPopupContent;
