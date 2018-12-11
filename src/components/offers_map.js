import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

import React from "react";

import { formatPrice, formatRooms } from "../lib/lib";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const accessToken =
  "pk.eyJ1IjoiYWRhbWhhbW1lcyIsImEiOiJjamQxczNrajQyd25kMndvNWR6cGdqYWl2In0.30k-mIhdJr0otiiSv8mQ-w";

const attribution =
  '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

const mapUrl =
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";

if (typeof window !== "undefined") {
  delete window.L.Icon.Default.prototype._getIconUrl;

  window.L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });
}

const OfferPopup = ({ offer }) => (
  <Popup maxHeight={250}>
    <h3>
      <a href={offer.url}>{offer.headline}</a>
    </h3>
    <strong>
      {formatRooms(offer.num_rooms)} | {formatPrice(offer.price)}
    </strong>
    <div dangerouslySetInnerHTML={{ __html: offer.description }} />
  </Popup>
);

const OffersMap = ({ city, offers }) => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <Map
      center={[city.latitude, city.longitude]}
      zoom={11}
      minZoom={9}
      maxZoom={17}
    >
      <TileLayer
        attribution={attribution}
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
            <OfferPopup offer={offer} />
          </Marker>
        ))}
      </MarkerClusterGroup>
    </Map>
  );
};

export default OffersMap;
