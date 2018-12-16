import React from "react";

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
            id="min-price"
            value={this.state.minPrice}
            onChange={this.onChange}
          />
          <span>à</span>
          {/* <input type="number" id="max-price" value={this.state.maxPrice} /> */}
        </section>
      </form>
    );
  }

  onChange(event) {
    const price = parseInt(event.target.value);
    const { onUpdate, offers } = this.props;

    this.setState({ minPrice: price }, () => {
      onUpdate(offers.filter(offer => offer.price > price * 100));
    });
  }
}
