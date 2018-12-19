import React from "react";

import filterOffers from "../lib/filter";

export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      minPrice: "",
      maxPrice: "",
    };
  }

  render() {
    return (
      <form className="filter-bar">
        <section className="price-container">
          <input
            type="number"
            id="minPrice"
            value={this.state.minPrice}
            onChange={this.onChange}
          />
          <span>à</span>
          <input
            type="number"
            id="maxPrice"
            value={this.state.maxPrice}
            onChange={this.onChange}
          />
        </section>
      </form>
    );
  }

  onChange(event) {
    const { onUpdate, offers } = this.props;

    this.setState({ [event.target.id]: event.target.value }, () => {
      onUpdate(filterOffers(offers, this.state));
    });
  }
}
