import React from "react";

import { objectFromIterable } from "../lib/api";
import filterOffers from "../lib/filter";
import { formatRooms } from "../lib/lib";

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

const roomSizes = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5];

export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    const defaultState = {
      [filterIdPrefix + "minPrice"]: "",
      [filterIdPrefix + "maxPrice"]: "",
    };

    if (this.props.ad_type.id === "rent") {
      roomSizes.forEach(
        numRooms => (defaultState[`${filterIdPrefix}${numRooms}rooms`] = true)
      );
    }

    this.state = defaultState;
  }

  render() {
    return (
      <div className="filter-bar-container">
        <input
          className="collapse-expand-input"
          id="collapse-expand"
          type="checkbox"
          defaultChecked={true}
        />
        <label className="collapse-expand-label" htmlFor="collapse-expand" />
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
          {this.props.ad_type.id !== "rent" ? null : (
            <section className="room-container">
              {roomSizes.map(numRooms => (
                <label
                  htmlFor={`${filterIdPrefix}${numRooms}rooms`}
                  key={numRooms}
                >
                  <input
                    type="checkbox"
                    id={`${filterIdPrefix}${numRooms}rooms`}
                    checked={this.state[`${filterIdPrefix}${numRooms}rooms`]}
                    onChange={this.onChange}
                  />
                  {formatRooms(numRooms)}
                </label>
              ))}
            </section>
          )}
        </form>
      </div>
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
