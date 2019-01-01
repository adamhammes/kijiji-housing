import React, { useState } from "react";
import { graphql } from "gatsby";

import "./front-page.scss";
import { LocalizedLink, Message } from "../components/lib";

export const query = graphql`
  {
    apiJson {
      cities {
        id
      }
      ad_types {
        id
      }
    }
  }
`;

const IndexPage = ({ data }) => {
  const { cities, ad_types } = data.apiJson;

  const [currentCity, setCity] = useState(cities[0]);
  const [currentAdType, setAdType] = useState(ad_types[0]);

  return (
    <form>
      <h2>
        <Message>frontPage.lookingFor</Message>
      </h2>
      <div className="options-container">
        {ad_types.map(a => (
          <label key={a.id}>
            <input
              key={a.id}
              type="radio"
              name="ad_type"
              value={a.id}
              defaultChecked={currentAdType.id === a.id}
              onChange={() => setAdType(a)}
            />
            <Message>{`frontPage.${a.id}`}</Message>
          </label>
        ))}
      </div>
      <h2>
        <Message>frontPage.in</Message>
      </h2>
      <div className="options-container">
        {cities.map(c => (
          <label key={c.id}>
            <input
              key={c.id}
              type="radio"
              name="city"
              value={c.id}
              checked={currentCity.id === c.id}
              onChange={() => setCity(c)}
            />
            <Message>{`cities.${c.id}`}</Message>
          </label>
        ))}
      </div>
      <LocalizedLink
        className="toOfferPage"
        to={`/${currentCity.id}/${currentAdType.id}/`}
      >
        <Message>frontPage.letsGo</Message>
      </LocalizedLink>
    </form>
  );
};

export default IndexPage;
