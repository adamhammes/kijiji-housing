import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster';

import React from 'react'

import { formatPrice, formatRooms } from '../lib/lib';

import '../components/app.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const accessToken =
  "pk.eyJ1IjoiYWRhbWhhbW1lcyIsImEiOiJjamQxczNrajQyd25kMndvNWR6cGdqYWl2In0.30k-mIhdJr0otiiSv8mQ-w";

const mapUrl =
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";


if (typeof window !== 'undefined') {
  delete window.L.Icon.Default.prototype._getIconUrl;

  window.L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  });
}

export default class OffersDisplay extends React.Component {
  render() {
    const { city, offers } = this.props.pathContext;
    const position = [city.latitude, city.longitude];

    if (typeof window === 'undefined') {
      return null;
    }

    return (
      <Map center={position} zoom={11} minZoom={9} maxZoom={17}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={mapUrl}
          id="mapbox.streets"
          accessToken={accessToken}
        />
        <MarkerClusterGroup
          spiderfyOnMaxZoom={false}
          disableClusteringAtZoom={16}
        >
          {offers.map(offer => (
            <Marker position={[offer.latitude, offer.longitude]} key={offer.id}>
              {this.renderPopup(offer)}
            </Marker>
          ))}
        </MarkerClusterGroup>
      </Map>
    )
  }

  renderPopup(offer) {
    return (
      <Popup maxHeight={250}>
        <h3><a href={offer.url}>{offer.headline}</a></h3>
        <strong>
          {formatRooms(offer.num_rooms)} | {formatPrice(offer.price)}
        </strong>
        <div dangerouslySetInnerHTML={{ __html: offer.description }}></div>
      </Popup>
    );
  }
}