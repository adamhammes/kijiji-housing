import React from "react";

import { objectFromIterable, formatRooms, plog } from "../lib/utils";
import filterOffers from "../lib/filter";
import { LocaleContext } from "./locale-context";
import LanguageSwitcher from "./language-switcher";
import { Localize } from "./lib";

const filterIdPrefix = "filter-";

const priceStepSize = {
  colocation: 25,
  rent: 50,
  buy: 25000,
};

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
      [filterIdPrefix + "includeNullPrice"]: false,
      [filterIdPrefix + "timeOnMarket"]: "",
    };

    if (this.props.ad_type.id === "rent") {
      roomSizes.forEach(
        numRooms => (defaultState[`${filterIdPrefix}${numRooms}rooms`] = true)
      );
    }

    this.state = defaultState;

    this.updateOffers = this.updateOffers.bind(this);
    this.updateOffers();
  }

  render() {
    const {
      onExpandCollapse,
      displayedOffers,
      allOffers,
      ad_type,
    } = this.props;
    const locale = this.context;

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
          <header className="mb-6 flex justify-between items-center">
            <h2 className="m-0">{locale("filter.title")}</h2>
            <LanguageSwitcher className="language-switcher" />
          </header>
          {locale("filter.offersShown", {
            numShown: displayedOffers.length,
            numTotal: allOffers.length,
          })}
          <h3>{locale("filters.priceRange")}</h3>
          <section className="price-container">
            <input
              type="number"
              min="0"
              step={priceStepSize[ad_type.id]}
              id={`${filterIdPrefix}minPrice`}
              value={this.state[`${filterIdPrefix}minPrice`]}
              onChange={this.onChange}
              placeholder={locale("filters.min")}
            />
            <span>{locale("filters.to")}</span>
            <input
              type="number"
              min="0"
              step={priceStepSize[ad_type.id]}
              id={`${filterIdPrefix}maxPrice`}
              value={this.state[`${filterIdPrefix}maxPrice`]}
              onChange={this.onChange}
              placeholder={locale("filters.max")}
            />
            <label>
              <input
                type="checkbox"
                id={`${filterIdPrefix}includeNullPrice`}
                value={this.state[`${filterIdPrefix}includeNullPrice`]}
                onChange={this.onChange}
              />
              <Localize>filters.includeNullPrice</Localize>
            </label>
          </section>
          <h3>{locale("filters.timeOnMarket")}</h3>
          <section>
            {locale("filters.lessThan")}&nbsp;&nbsp;
            <input
              type="number"
              min="0"
              id={`${filterIdPrefix}timeOnMarket`}
              value={this.state[`${filterIdPrefix}timeOnMarket`]}
              onChange={this.onChange}
            />
            &nbsp;&nbsp;{locale("filters.daysOld")}
          </section>
          {ad_type.id !== "rent" ? null : (
            <>
              <h3>{locale("filters.numberOfRooms")}</h3>
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
    const targetValue = getValueForInput(event.target);

    plog("start filtering");
    this.setState({ [event.target.id]: targetValue }, () => {
      plog("finished filtering");
      this.updateOffers();
    });
  }

  updateOffers() {
    const filterState = removePrefixFromState(this.state);
    this.props.onUpdate(filterOffers(this.props.allOffers, filterState));
  }
}

FilterBar.contextType = LocaleContext;
