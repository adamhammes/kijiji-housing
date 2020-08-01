import React, { useState, useContext } from "react";
import { graphql } from "gatsby";
import { Localize, LocalizeLink, LocaleContext } from "../components/lib";
import "../pages/front-page.scss";

const CityDisplay = ({ data, pageContext }) => {
  const { city } = pageContext;

  const [selectedAdType, setSelectedAdType] = useState(ad_types[0]);

  const locale = useContext(LocaleContext);
  const cityName = locale(`cities.${city.id}`);

  return (
    <form>
      <h2>
        <Localize>frontPage.lookingFor</Localize>
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
            <Localize>{`frontPage.${ad_type.id}`}</Localize>
          </label>
        ))}
      </div>
      <h2>
        <Localize city={cityName}>cityDisplay.inCity</Localize>
      </h2>
      <LocalizeLink to={`/${city.id}/${selectedAdType.id}`}>
        <Localize>frontPage.letsGo</Localize>
      </LocalizeLink>
    </form>
  );
};

export default CityDisplay;
