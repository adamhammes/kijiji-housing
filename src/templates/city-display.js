import React, { useState, useContext } from "react";
import { graphql } from "gatsby";
import { Message, LocalizedLink, LocaleContext } from "../components/lib";
import "../pages/front-page.scss";

export const query = graphql`
  {
    apiJson {
      ad_types {
        id
      }
    }
  }
`;

const CityDisplay = ({ data, pageContext }) => {
  const { city } = pageContext;

  const { ad_types } = data.apiJson;
  const [selectedAdType, setSelectedAdType] = useState(ad_types[0]);

  const locale = useContext(LocaleContext);
  const cityName = locale(`cities.${city.id}`);

  return (
    <form>
      <h2>
        <Message>frontPage.lookingFor</Message>
      </h2>
      <div className="options-container">
        {ad_types.map(ad_type => (
          <label key={ad_type.id}>
            <input
              type="radio"
              value={ad_type.id}
              name="ad_type"
              checked={selectedAdType.id === ad_type.id}
              onChange={() => setSelectedAdType(ad_type)}
            />
            <Message>{`frontPage.${ad_type.id}`}</Message>
          </label>
        ))}
      </div>
      <h2>
        <Message city={cityName}>cityDisplay.inCity</Message>
      </h2>
      <LocalizedLink to={`/${city.id}/${selectedAdType.id}`}>
        <Message>frontPage.letsGo</Message>
      </LocalizedLink>
    </form>
  );
};

export default CityDisplay;
