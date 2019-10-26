import React from "react";

import FilterBar from "../components/filter_bar";
import OffersMap from "../components/offers_map";
import { formatPrice, plog } from "../lib/utils";

import "./offers-display.scss";
import { LocaleContext } from "../components/locale-context";

export default class OffersDisplay extends React.Component {
  constructor(props) {
    super(props);

    const { offers } = this.props.pageContext;

    this.state = {
      allOffers: offers,
      displayedOffers: offers,
      descriptionsLoaded: false,
    };

    this.onFilterUpdate = this.onFilterUpdate.bind(this);
    this.onExpandCollapse = this.onExpandCollapse.bind(this);
    this.bindInvalidateBounds = this.bindInvalidateBounds.bind(this);
  }

  componentDidMount() {
    this.isMounted_ = true;

    const { descriptionsPath } = this.props.pageContext;
    const locale = this.context;

    plog("fetching apartment descriptions");
    fetch(descriptionsPath)
      .then(res => res.json())
      .then(descriptions => {
        if (!this.isMounted_) {
          return;
        }

        plog("descriptions received");

        const offersWithDescription = this.state.allOffers.slice();

        descriptions.forEach((description, index) => {
          const offer = offersWithDescription[index];
          offer.description = description;
          offer.formattedPrice = formatPrice(locale, offer.price);
        });

        console.log(
          "Developer note: All the offers on this page are stored in " +
            "`window.offers`. Cheers!"
        );
        window.offers = offersWithDescription;

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
    this.setState({ displayedOffers: offers });
  }

  onExpandCollapse() {
    if (this.invalidateBounds) {
      this.invalidateBounds();
    }
  }

  bindInvalidateBounds(func) {
    this.invalidateBounds = func;
  }

  render() {
    const { city, ad_type, roomsEnabled } = this.props.pageContext;

    return (
      <>
        <div className="offers-display">
          <FilterBar
            allOffers={this.state.allOffers}
            displayedOffers={this.state.displayedOffers}
            onUpdate={this.onFilterUpdate}
            ad_type={ad_type}
            onExpandCollapse={this.onExpandCollapse}
            roomsEnabled={roomsEnabled}
          />
          <OffersMap
            city={city}
            offers={this.state.displayedOffers}
            ad_type={ad_type}
            descriptionsLoaded={this.state.descriptionsLoaded}
            bindInvalidateBounds={this.bindInvalidateBounds}
          />
        </div>
      </>
    );
  }
}

OffersDisplay.contextType = LocaleContext;
