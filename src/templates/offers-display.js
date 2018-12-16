import React from "react";

import FilterBar from "../components/filter_bar";
import OffersMap from "../components/offers_map";
import "../components/app.css";
import "./offers-display.css";

export default class OffersDisplay extends React.Component {
  constructor(props) {
    super(props);

    const allOffers = {};

    const { offers } = this.props.pageContext;

    offers.forEach(offer => (allOffers[offer.id] = offer));

    this.state = {
      allOffers,
      displayedOffers: Object.values(allOffers),
      descriptionsLoaded: false,
    };

    this.onFilterUpdate = this.onFilterUpdate.bind(this);
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

        this.setState({
          allOffers: offersWithDescription,
          descriptionsLoaded: true,
        });
      });
  }

  componentWillUnmount() {
    this.isMounted_ = false;
  }

  onFilterUpdate(offers) {
    console.log(offers.length);
    this.setState({ displayedOffers: offers });
  }

  render() {
    const { city, ad_type } = this.props.pageContext;

    if (typeof window === "undefined") {
      return null;
    }

    return (
      <div className="offers-display">
        <FilterBar
          offers={Object.values(this.state.allOffers)}
          onUpdate={this.onFilterUpdate}
        />
        <OffersMap
          city={city}
          offers={this.state.displayedOffers}
          ad_type={ad_type}
          descriptionsLoaded={this.state.descriptionsLoaded}
        />
      </div>
    );
  }
}
