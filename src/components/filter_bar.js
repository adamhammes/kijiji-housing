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

const getValueForInput = inputElem => {
  if (inputElem.type === "checkbox") {
    return inputElem.checked;
  }

  return inputElem.value;
};

export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      [filterIdPrefix + "minPrice"]: "",
      [filterIdPrefix + "maxPrice"]: "",
      [filterIdPrefix + "1.5rooms"]: true,
      [filterIdPrefix + "2.5rooms"]: true,
      [filterIdPrefix + "3.5rooms"]: true,
      [filterIdPrefix + "4.5rooms"]: true,
      [filterIdPrefix + "5.5rooms"]: true,
      [filterIdPrefix + "6.5rooms"]: true,
    };
  }

  render() {
    return (
      <form className="filter-bar">
        <section className="price-container">
          <input
            type="number"
            id={`${filterIdPrefix}minPrice`}
            value={this.state[`${filterIdPrefix}minPrice`]}
            onChange={this.onChange}
          />
          <span>à</span>
          <input
            type="number"
            id={`${filterIdPrefix}maxPrice`}
            value={this.state[`${filterIdPrefix}maxPrice`]}
            onChange={this.onChange}
          />
        </section>
        <section className="room-container">
          <label htmlFor={`${filterIdPrefix}1.5rooms`}>
            <input
              type="checkbox"
              id={`${filterIdPrefix}1.5rooms`}
              checked={this.state[`${filterIdPrefix}1.5rooms`]}
              onChange={this.onChange}
            />
            1.5
          </label>
          <label htmlFor={`${filterIdPrefix}2.5rooms`}>
            <input
              type="checkbox"
              id={`${filterIdPrefix}2.5rooms`}
              checked={this.state[`${filterIdPrefix}2.5rooms`]}
              onChange={this.onChange}
            />
            2.5
          </label>
          <label htmlFor={`${filterIdPrefix}3.5rooms`}>
            <input
              type="checkbox"
              id={`${filterIdPrefix}3.5rooms`}
              checked={this.state[`${filterIdPrefix}3.5rooms`]}
              onChange={this.onChange}
            />
            3.5
          </label>
          <label htmlFor={`${filterIdPrefix}4.5rooms`}>
            <input
              type="checkbox"
              id={`${filterIdPrefix}4.5rooms`}
              checked={this.state[`${filterIdPrefix}4.5rooms`]}
              onChange={this.onChange}
            />
            4.5
          </label>
          <label htmlFor={`${filterIdPrefix}5.5rooms`}>
            <input
              type="checkbox"
              id={`${filterIdPrefix}5.5rooms`}
              checked={this.state[`${filterIdPrefix}5.5rooms`]}
              onChange={this.onChange}
            />
            5.5
          </label>
          <label htmlFor={`${filterIdPrefix}6.5rooms`}>
            <input
              type="checkbox"
              id={`${filterIdPrefix}6.5rooms`}
              checked={this.state[`${filterIdPrefix}6.5rooms`]}
              onChange={this.onChange}
            />
            6.5+
          </label>
        </section>
      </form>
    );
  }

  onChange(event) {
    const { onUpdate, offers } = this.props;

    const targetValue = getValueForInput(event.target);

    this.setState({ [event.target.id]: targetValue }, () => {
      onUpdate(filterOffers(offers, removePrefixFromState(this.state)));
    });
  }
}
