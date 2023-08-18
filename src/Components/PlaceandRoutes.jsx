import { useState, useEffect } from "react";
import React from "react";
import AutoComplete from "./AutoComplete";
import { TextField } from "@mui/material";
import Alert from "./Alert";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
const PlaceandRoutes = () => {
  const [latlong, setlatlong] = useState({
    lat: "",
    long: "",
  });
  const Locations = [21.7679, 78.8718];
  const [Location, setLocation] = useState([]);
  const [Text, setText] = useState({ name: "" });
  const [SuccessAlerts, setSuccessAlerts] = useState(false);
  const [ErrorAlerts, setErrorAlerts] = useState(false);
  const [Map, setMap] = useState(false);
  const receiveDataFromChild = (a) => {
    setlatlong({ ...latlong, lat: a.lat, long: a.long });
    setSuccessAlerts(true);
    setMap(true);
  };

  useEffect(() => {
    if (SuccessAlerts || ErrorAlerts) {
      setTimeout(() => {
        setSuccessAlerts(false);
        setErrorAlerts(false);
      }, 3000); // Set Alerts to false after 3 seconds
    }
  }, [SuccessAlerts, ErrorAlerts]);

  const handleSubmit = () => {
    var Obj = {
      location: latlong,
      placeName: Text.name,
      polygon: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: [
                [72.87290405001278, 19.076865890212943],
                [72.87822295275632, 19.074251936879264],
                [72.88439287993836, 19.079680870759432],
                [72.87886122108517, 19.084707502751726],
                [72.87311680612248, 19.077066961838113],
              ],
              type: "LineString",
            },
          },
        ],
      },
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5050/placeandroutes",
      headers: {
        "Content-Type": "application/json",
      },
      data: Obj,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.message == "Data inserted successfully") {
          setSuccessAlerts(true);
        } else {
          setErrorAlerts(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex w-full min-h-[94vh]  ">
      <div className="max-w-6xl w-full p-5 ">
        <AutoComplete Data={receiveDataFromChild} />
        <br />
        <div className="flex flex-col gap-5 min-w-full max-w-xs ">
          <TextField
            label="Lat and long"
            value={latlong.lat + "," + latlong.long}
          />
          <TextField
            label="Name"
            onChange={(e) => setText({ ...Text, name: e.target.value })}
            value={Text.name}
          />
          <div className="text-center ">
            <button
              className="bg-blue-500 w-28 h-10 rounded-lg font-bold text-white hover:bg-blue-700 transition "
              onClick={handleSubmit}
            >
              Submit{" "}
            </button>
          </div>
        </div>
        {SuccessAlerts ? (
          <Alert
            error={true}
            type={"success"}
            message={"status has been updated"}
          />
        ) : (
          ""
        )}
        {ErrorAlerts ? (
          <Alert
            error={true}
            type={"error"}
            message={"ERROR Please try again Later!"}
          />
        ) : (
          ""
        )}
      </div>
      <div className=" max-w-5xl w-full border-l-4 p-3">
        {Map ? (
          <MapContainer
            center={[latlong.lat, latlong.long]} // Center the map on the "from" point
            zoom={5}
            style={{ height: "700px", borderRadius: "10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={
                Location.length !== 0 ? Location : [latlong.lat, latlong.long]
              }
            ></Marker>
          </MapContainer>
        ) : (
          <>Please Select the Location....</>
        )}
      </div>
    </div>
  );
};

export default PlaceandRoutes;
