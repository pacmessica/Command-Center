import React, { Fragment } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

const MyPopupMarker = ({ content, position }) => (
  <Marker position={position}>
    <Popup>{content}</Popup>
  </Marker>
);

const MyMarkersList = ({ markers }) => {
  const items = markers.map(({ key, ...props }) => (
    <MyPopupMarker key={key} {...props} />
  ));
  return <Fragment>{items}</Fragment>;
};

function LeafletMap(props) {
  let bounds = props.markers.map(({ position }) => position);
  return (
    <Map bounds={bounds}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MyMarkersList markers={props.markers} />
    </Map>
  );
}

export default React.memo(LeafletMap);
