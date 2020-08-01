import { formatRooms, timeOnMarketFormatted } from "../lib/utils";

const genPopupContent = (offer, ad_type, locale) => `
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
      ${
        ad_type.id === "rent" && offer.num_rooms != null
          ? ` | ${formatRooms(locale, offer.num_rooms)}`
          : ""
      }
      | ${timeOnMarketFormatted(locale.language, offer.date_posted)}
    </strong>
  </p>
  ${offer.description}
`;

export default genPopupContent;
