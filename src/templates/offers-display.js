import React from 'react'

import OffersMap from '../components/offers_map';
import '../components/app.css';

export default class OffersDisplay extends React.Component {
  render() {
    const { city, offers } = this.props.pathContext;

    if (typeof window === 'undefined') {
      return null;
    }

    return <OffersMap city={city} offers={offers} />
  }
}