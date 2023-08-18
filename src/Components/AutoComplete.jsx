import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

const PlaceandRoutes = ({ status, Data }) => {
  const [Suggestions, setSuggestions] = useState([]);
  const [Status, setStatus] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    lat: 0,
    long: 0,
  });
  let timeoutId;
  const showRoute = async (e) => {
    const Value = e.target.value;
    clearTimeout(timeoutId); // Clear any previous timeouts
    console.log(Value.length);
    timeoutId = setTimeout(async () => {
      if (Value.length >= 2) {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://api.openrouteservice.org/geocode/autocomplete?api_key=5b3ce3597851110001cf6248683adac4e0e7468f88ea0f21498555ba&countrycodes=IN&text=${Value}`,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Accept:
              "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          },
        };

        axios
          .request(config)
          .then(async (response) => {
            const data = await response.data.features.map((res) => ({
              label: res.properties.label,
              coordinates: res.geometry.coordinates,
            }));
            setSuggestions(data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (Value.length <= 1) {
        setSuggestions([]);
      }
    }, 300); // Wait for 300 milliseconds after the user stops typing
  };
  const handlePlaceSelect = (selectedValue) => {
    if (selectedValue && selectedValue.coordinates) {
      setSelectedCoordinates({
        lat: selectedValue.coordinates[1],
        long: selectedValue.coordinates[0],
      });
    }
  };
  const handleOpen = () => {
    if (status) {
      status();
    } else {
      Data(selectedCoordinates);
    }
  };

  return (
    <>
      <div>
        <div className=" border-4 flex gap-5 flex-col items-center rounded-xl   p-4 ">
          <div className=" ">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={Suggestions}
              onInput={showRoute}
              onChange={(event, value) => handlePlaceSelect(value)}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Places"
                />
              )}
            />
          </div>
          <div>
            <button
              className="bg-green-600 w-44 h-10 rounded-md text-white hover:bg-green-800 transition"
              onClick={handleOpen}
            >
              Upload{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceandRoutes;
