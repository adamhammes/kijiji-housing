import React from "react";
import { graphql } from "gatsby";

import "./front-page.scss";
import { Localize } from "../components/lib";
import { whitelistedCities } from "../lib/build_helper";
import CityChoice from "../components/city-choice/city-choice";

export const query = graphql`
  {
    apiJson {
      cities {
        id
      }
    }
  }
`;

const IndexPage = ({ data }) => {
  let { cities } = data.apiJson;

  cities = cities.filter(({ id }) => whitelistedCities.includes(id));

  return (
    <>
      <h1 className="my-12">
        <Localize>frontPage.lookingForApartment</Localize>
      </h1>
      <ul className="list-reset flex flex-col sm:flex-row align-center align-start flex-wrap -mx-2 lg:-mx-3">
        {cities.map(city => (
          <CityChoice key={city.id} city={city} />
        ))}
      </ul>
    </>
  );
};

export default IndexPage;
