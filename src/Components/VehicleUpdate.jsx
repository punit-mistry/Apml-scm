import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const VehicleUpdate = ({ status, row }) => {
  const [VehicleStatusData, setVehicleStatusData] = useState([]);
  const [dateTimeValues, setDateTimeValues] = useState({
    arrivedAt: "",
    gateIn: "",
    loadingStart: "",
    loadingEnd: "",
    departure: "",
    markedArrival: "",
    UnLodingPoint: "",
    GateInUnloading: "",
    UnloadingStart: "",
    UnloadingEnd: "",
    UnloadingDeparted: "",
  });

  const CallApi = async () => {
    const response = await axios.get(
      `http://localhost:5050/VehicleStatus/get?filter={"uuid":"${row.uuid}"}`
    );
    setVehicleStatusData(response.data.data);

    // Set initial dateTimeValues here
    if (response.data.data.length > 0) {
      const firstData = response.data.data[0];
      setDateTimeValues({
        arrivedAt: firstData.arrivedAt
          ? new Date(firstData.arrivedAt).toISOString().slice(0, -1)
          : "",
        gateIn: firstData.gateIn
          ? new Date(firstData.gateIn).toISOString().slice(0, -1)
          : "",
        loadingStart: firstData.loadingStart
          ? new Date(firstData.loadingStart).toISOString().slice(0, -1)
          : "",
        loadingEnd: firstData.loadingEnd
          ? new Date(firstData.loadingEnd).toISOString().slice(0, -1)
          : "",
        departure: firstData.departure
          ? new Date(firstData.departure).toISOString().slice(0, -1)
          : "",
        markedArrival: firstData.markedArrival
          ? new Date(firstData.markedArrival).toISOString().slice(0, -1)
          : "",

        UnLodingPoint: firstData.UnLodingPoint
          ? new Date(firstData.UnLodingPoint).toISOString().slice(0, -1)
          : "",
        GateInUnloading: firstData.GateInUnloading
          ? new Date(firstData.GateInUnloading).toISOString().slice(0, -1)
          : "",
        UnloadingStart: firstData.UnloadingStart
          ? new Date(firstData.UnloadingStart).toISOString().slice(0, -1)
          : "",
        UnloadingEnd: firstData.UnloadingEnd
          ? new Date(firstData.UnloadingEnd).toISOString().slice(0, -1)
          : "",
        UnloadingDeparted: firstData.UnloadingDeparted
          ? new Date(firstData.UnloadingDeparted).toISOString().slice(0, -1)
          : "",
      });
    }
  };

  useEffect(() => {
    CallApi();
  }, []);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const milliseconds = Date.parse(value);

    await setDateTimeValues({
      ...dateTimeValues,
      [name]: milliseconds,
    });
    try {
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `http://localhost:5050/Vehicle/update/${VehicleStatusData[0]._id}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: dateTimeValues,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <>
      {console.log(status)}
      {status === "AtPickup" && (
        <div className="border text-black border-gray-500 rounded-lg h-full p-5">
          {" "}
          <h1 className="text-xl font-bold "> Delivery Info</h1>
          <br />
          <div className="flex  flex-col gap-5">
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold text-red-600">At Pickup:</h1>
              </AccordionSummary>
              <AccordionDetails className="">
                <div className="flex flex-col gap-5 ">
                  <div className="flex justify-between">
                    <label className="font-bold ">Arrived at: </label>
                    <input
                      type="datetime-local"
                      className="text-red-500"
                      name="arrivedAt"
                      value={
                        dateTimeValues.arrivedAt
                          ? new Date(dateTimeValues.arrivedAt)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">Gate in: </label>
                    <input
                      type="datetime-local"
                      name="gateIn"
                      value={
                        dateTimeValues.gateIn
                          ? new Date(dateTimeValues.gateIn)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">Loading Start: </label>
                    <input
                      type="datetime-local"
                      name="loadingStart"
                      value={
                        dateTimeValues.loadingStart
                          ? new Date(dateTimeValues.loadingStart)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">Loading End: </label>
                    <input
                      type="datetime-local"
                      name="loadingEnd"
                      value={
                        dateTimeValues.loadingEnd
                          ? new Date(dateTimeValues.loadingEnd)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">Departure: </label>
                    <input
                      type="datetime-local"
                      name="departure"
                      value={
                        dateTimeValues.departure
                          ? new Date(dateTimeValues.departure)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold text-red-600">Intransit:</h1>
              </AccordionSummary>
              <AccordionDetails className="">
                <div className="flex flex-col gap-5 ">
                  <div className="flex justify-between">
                    <label className="font-bold ">Marked Arrived:</label>
                    <input
                      type="datetime-local"
                      name="markedArrival"
                      value={
                        dateTimeValues.markedArrival
                          ? new Date(dateTimeValues.markedArrival)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold text-red-600">
                  At Unloading:
                </h1>
              </AccordionSummary>
              <AccordionDetails className="">
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between">
                    <label className="font-bold ">At Unloading Point: </label>
                    <input
                      type="datetime-local"
                      name="UnLodingPoint"
                      value={
                        dateTimeValues.UnLodingPoint
                          ? new Date(dateTimeValues.UnLodingPoint)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">Unloading Gate in: </label>
                    <input
                      type="datetime-local"
                      name="GateInUnloading"
                      value={
                        dateTimeValues.GateInUnloading
                          ? new Date(dateTimeValues.GateInUnloading)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">UnLoading Start: </label>
                    <input
                      type="datetime-local"
                      name="UnloadingStart"
                      value={
                        dateTimeValues.UnloadingStart
                          ? new Date(dateTimeValues.UnloadingStart)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">UnLoading End: </label>
                    <input
                      type="datetime-local"
                      name="UnloadingEnd"
                      value={
                        dateTimeValues.UnloadingEnd
                          ? new Date(dateTimeValues.UnloadingEnd)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">Departure: </label>
                    <input
                      type="datetime-local"
                      name="UnloadingDeparted"
                      value={
                        dateTimeValues.UnloadingDeparted
                          ? new Date(dateTimeValues.UnloadingDeparted)
                              .toISOString()
                              .slice(0, -1)
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <br />
          <hr />
          <br />
          <p className="text-xl">
            <span className=" ">Status</span> :- {row?.Data?.GCStatus}
          </p>
        </div>
      )}
    </>
  );
};

export default VehicleUpdate;
