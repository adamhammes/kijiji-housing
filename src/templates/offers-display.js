import React from "react";

import Layout from "../components/layout";
import FilterBar from "../components/filter_bar";
import OffersMap from "../components/offers_map";
import { formatPrice } from "../lib/lib";

import "./offers-display.scss";

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

    const { scrapeId, city, ad_type, locale } = this.props.pageContext;

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

        Object.entries(descriptionsById).forEach(([id, description]) => {
          const offer = offersWithDescription[id];
          offer.description = description;
          offer.formattedPrice = formatPrice(locale.language, offer.price);
        });

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
    const { city, ad_type, locale } = this.props.pageContext;

    return (
      <Layout renderHeader={false}>
        <div className="offers-display">
          <FilterBar
            offers={Object.values(this.state.allOffers)}
            onUpdate={this.onFilterUpdate}
            ad_type={ad_type}
            locale={locale}
          />
          <OffersMap
            city={city}
            offers={this.state.displayedOffers}
            ad_type={ad_type}
            descriptionsLoaded={this.state.descriptionsLoaded}
          />
        </div>
      </Layout>
    );
  }
}
