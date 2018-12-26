import React from "react";

import { objectFromIterable, formatRooms, plog } from "../lib/utils";
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
    const { messages } = this.props.locale;
    const { onExpandCollapse } = this.props;

    return (
      <div className="filter-bar-container">
        <input
          className="collapse-expand-input"
          id="collapse-expand"
          type="checkbox"
          defaultChecked={true}
          onClick={onExpandCollapse}
        />
        <label className="collapse-expand-label" htmlFor="collapse-expand" />
        <form className="filter-bar">
          <h3>{messages.filters.priceRange}</h3>
          <section className="price-container">
            <input
              type="number"
              id={`${filterIdPrefix}minPrice`}
              value={this.state[`${filterIdPrefix}minPrice`]}
              onChange={this.onChange}
              placeholder={messages.filters.min}
            />
            <span>{messages.filters.to}</span>
            <input
              type="number"
              id={`${filterIdPrefix}maxPrice`}
              value={this.state[`${filterIdPrefix}maxPrice`]}
              onChange={this.onChange}
              placeholder={messages.filters.max}
            />
          </section>
          {this.props.ad_type.id !== "rent" ? null : (
            <>
              <h3>{messages.filters.numberOfRooms}</h3>
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
            </>
          )}
        </form>
      </div>
    );
  }

  onChange(event) {
    const { onUpdate, offers } = this.props;

    const targetValue = getValueForInput(event.target);

    plog("start filtering");
    this.setState({ [event.target.id]: targetValue }, () => {
      plog("finished filtering");
      onUpdate(filterOffers(offers, removePrefixFromState(this.state)));
    });
  }
}
