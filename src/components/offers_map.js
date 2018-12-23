import "leaflet";
import "leaflet.markercluster";
import React from "react";
import ReactDOM from "react-dom";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import genPopupContent from "./popup";

const accessToken =
  "pk.eyJ1IjoiYWRhbWhhbW1lcyIsImEiOiJjamQxczNrajQyd25kMndvNWR6cGdqYWl2In0.30k-mIhdJr0otiiSv8mQ-w";

const attribution =
  '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

const mapUrl =
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";

let L;
if (typeof window !== "undefined") {
  delete window.L.Icon.Default.prototype._getIconUrl;
  L = window.L;

  window.L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });
}

class OffersMap extends React.Component {
  constructor(props) {
    super(props);

    this.markerCache = new Map();
    this.loadedPopups = new Set();

    this.markerForOffer = this.markerForOffer.bind(this);
  }

  componentDidMount() {
    const { city } = this.props;

    const parent = ReactDOM.findDOMNode(this);

    this.map = L.map(parent).setView([city.latitude, city.longitude], 11);
    this.map.zoomControl.setPosition("topright");

    L.tileLayer(mapUrl, {
      attribution,
      maxZoom: 17,
      id: "mapbox.streets",
      accessToken,
    }).addTo(this.map);

    this.markerCluster = L.markerClusterGroup({
      chunkedLoading: true,
    });

    this.map.addLayer(this.markerCluster);

    this.props.offers.forEach(this.markerForOffer);
  }

  markerForOffer(offer) {
    let marker;
    if (!this.markerCache.has(offer.id)) {
      marker = L.marker([offer.latitude, offer.longitude]);
      this.markerCache.set(offer.id, marker);
    } else {
      marker = this.markerCache.get(offer.id);
    }

    if (this.props.descriptionsLoaded && !this.loadedPopups.has(offer.id)) {
      const popupContent = genPopupContent(offer);
      const popup = L.popup({
        maxHeight: 250,
        maxWidth: Math.min(300, window.innerWidth - 50),
      }).setContent(popupContent);

      marker.bindPopup(popup);
      this.loadedPopups.add(offer.id);
    }

    return marker;
  }

  render() {
    if (this.markerCluster) {
      this.markerCluster.clearLayers();
      this.markerCluster.addLayers(
        Array.from(this.props.offers.map(offer => this.markerForOffer(offer)))
      );
    }

    return <div />;
  }
}

export default OffersMap;
