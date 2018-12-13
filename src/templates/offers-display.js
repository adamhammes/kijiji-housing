import React from "react";

import OffersMap from "../components/offers_map";
import "../components/app.css";

export default class OffersDisplay extends React.Component {
  constructor(props) {
    super(props);

    const allOffers = {};

    const { offers } = this.props.pageContext;

    offers.forEach(offer => (allOffers[offer.id] = offer));

    this.state = {
      allOffers,
      displayedOffers: Object.keys(allOffers),
    };
  }

  componentDidMount() {
    this.isMounted_ = true;

    const { scrapeId, city, ad_type } = this.props.pageContext;

    const descriptionsPath = `/api/${scrapeId}_${city.id}-${
      ad_type.id
    }-descriptions.json`;

    fetch(descriptionsPath)
      .then(res => res.json())
      .then(descriptionsById => {
        if (!this.isMounted_) {
          return;
        }

        const offersWithDescription = Object.assign({}, this.state.allOffers);

        Object.entries(descriptionsById).forEach(
          ([id, description]) =>
            (offersWithDescription[id].description = description)
        );

        this.setState({ allOffers: offersWithDescription });
      });
  }

  componentWillUnmount() {
    this.isMounted_ = false;
  }

  render() {
    const { city, offers, ad_type } = this.props.pageContext;

    if (typeof window === "undefined") {
      return null;
    }

    return <OffersMap city={city} offers={offers} ad_type={ad_type} />;
  }
}
