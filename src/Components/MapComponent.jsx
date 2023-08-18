import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Home from "../assets/Home.svg";
import Dedstination from "../assets/destination.svg";
import Truck from "../assets/Truck.svg";
import Materials from "../assets/Material.svg";
const MapComponent = ({
  // VehicleLocation,
  VehicleNumber,
  fromlat,
  fromlong,
  tolat,
  tolong,
  height,
  radius,
  Material,
}) => {
  const positionFrom = [fromlat, fromlong]; // Latitude and Longitude for the "from" point
  const positionTo = [tolat, tolong]; // Latitude and Longitude for the "to" point
  const fillBlueOptions = { fillColor: "blue" };
  const routePositions = [positionFrom, positionTo];

  // const VehiclePositions = [
  //   VehicleLocation[1] ? VehicleLocation[1] : 0,
  //   VehicleLocation[0] ? VehicleLocation[0] : 0,
  // ];
  const MaterialPositions = [Material[0], Material[1]];

  const MaterialroutePositions = [MaterialPositions, positionTo];
  const customIcon = L.icon({
    iconUrl: Home, // Path to your custom icon image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor point for the icon
    popupAnchor: [0, -32], // Popup anchor for the icon
  });
  const DestinationIcon = L.icon({
    iconUrl: Dedstination, // Path to your custom icon image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor point for the icon
    popupAnchor: [0, -32], // Popup anchor for the icon
  });
  const TruckIcon = L.icon({
    iconUrl: Truck, // Path to your custom icon image
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [16, 32], // Anchor point for the icon
    popupAnchor: [0, -32], // Popup anchor for the icon
  });
  const MaterialIcon = L.icon({
    iconUrl: Materials, // Path to your custom icon image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor point for the icon
    popupAnchor: [0, -32], // Popup anchor for the icon
  });

  return (
    <div className="h-96">
      <MapContainer
        center={positionFrom} // Center the map on the "from" point
        zoom={5}
        style={{ height: height, borderRadius: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline
          positions={routePositions}
          color="black"
          weight={3}
          dashArray="20, 20"
          dashOffset={0}
        />{" "}
        <Polyline
          positions={MaterialroutePositions}
          color="green"
          weight={3}
          dashArray="20, 20"
          dashOffset={0}
        />{" "}
        {/* Add route line */}
        {radius ? (
          <Circle
            center={positionFrom}
            pathOptions={fillBlueOptions}
            radius={200}
          />
        ) : (
          ""
        )}
        <Marker
          position={positionFrom}
          icon={customIcon}
        >
          <Popup>
            From: Latitude {fromlat}, Longitude {fromlong}
          </Popup>
        </Marker>
        <Marker
          position={positionTo}
          icon={DestinationIcon}
        >
          <Popup>
            To: Latitude {tolat}, Longitude {tolong}
          </Popup>
        </Marker>
        {/* <Marker
          position={VehiclePositions}
          icon={TruckIcon}
        >
          <Popup>Vehicle Number:{VehicleNumber}</Popup>
        </Marker> */}
        <Marker
          position={MaterialPositions}
          icon={MaterialIcon}
        >
          <Popup>Vehicle Number:{VehicleNumber}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
