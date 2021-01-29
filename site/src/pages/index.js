import React from "react";
import { graphql } from "gatsby";

import "./front-page.scss";
import { Localize } from "../components/lib";
import { whitelistedCities } from "../lib/build_helper";
import CityChoice from "../components/city-choice/city-choice";

export const query = graphql`
  {
    allKijijiCity {
      nodes {
        latitude
        longitude
        short_code
      }
    }
  }
`;

const IndexPage = ({ data }) => {
  let cities = data.allKijijiCity.nodes;

  cities = cities.filter(({ short_code }) =>
    whitelistedCities.includes(short_code)
  );

  return (
    <>
      <h1 style={{ marginTop: "3rem" }}>À la carte is no longer maintained.</h1>
      <p>
        Unfortunately, kijiji has put measures in place to prevent me from
        collecting their data. As such, I can no longer update this site with
        new offers. I apologize for the inconvenience, and wish you the best of
        luck in your apartment search.
      </p>
      <p>
        Should you wish to use the data on this site for non-profit purposes,
        you can contact me at <a href="mailto:adam@hammes.io">adam@hammes.io</a>
        . I have a large amount of data collected, dating back to January of
        2018.
      </p>
      <p>- Adam</p>
    </>
  );
};

export default IndexPage;
