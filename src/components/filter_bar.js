import React from "react";

import { objectFromIterable } from "../lib/api";
import filterOffers from "../lib/filter";

const filterIdPrefix = "filter-";

const removePrefixFromState = state =>
  objectFromIterable(
    Object.entries(state).map(([key, value]) => [
      key.replace(filterIdPrefix, ""),
      value,
    ])
  );

export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      [filterIdPrefix + "minPrice"]: "",
      [filterIdPrefix + "maxPrice"]: "",
    };
  }

  render() {
    return (
      <form className="filter-bar">
        <section className="price-container">
          <input
            type="number"
            id={`${filterIdPrefix}minPrice`}
            value={this.state[filterIdPrefix + "minPrice"]}
            onChange={this.onChange}
          />
          <span>à</span>
          <input
            type="number"
            id={`${filterIdPrefix}maxPrice`}
            value={this.state[filterIdPrefix + "maxPrice"]}
            onChange={this.onChange}
          />
        </section>
      </form>
    );
  }

  onChange(event) {
    const { onUpdate, offers } = this.props;

    this.setState({ [event.target.id]: event.target.value }, () => {
      onUpdate(filterOffers(offers, removePrefixFromState(this.state)));
    });
  }
}
