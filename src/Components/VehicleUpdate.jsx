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
    arrivedAt: VehicleStatusData[0]?.arrivedAt
      ? new Date(VehicleStatusData[0].arrivedAt).toISOString().slice(0, -1)
      : "",
    gateIn: VehicleStatusData[0]?.gateIn
      ? new Date(VehicleStatusData[0].gateIn).toISOString().slice(0, -1)
      : "",
    loadingStart: VehicleStatusData[0]?.loadingStart
      ? new Date(VehicleStatusData[0].loadingStart).toISOString().slice(0, -1)
      : "",
    loadingEnd: VehicleStatusData[0]?.loadingEnd
      ? new Date(VehicleStatusData[0].loadingEnd).toISOString().slice(0, -1)
      : "",
    departure: VehicleStatusData[0]?.departure
      ? new Date(VehicleStatusData[0].departure).toISOString().slice(0, -1)
      : "",
  });

  const CallApi = async () => {
    const response = await axios.get(
      `http://localhost:5050/VehicleStatus/get?filter={"uuid":"${row.uuid}"}`
    );
    setVehicleStatusData(response.data.data);
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
          <h1 className="text-xl font-bold "> Delivery Info </h1>
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
                    <label className="font-bold ">Marked Arrived: </label>
                    <input
                      type="datetime-local"
                      className="text-red-500"
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
                      className="text-red-500"
                    />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">Unloading Gate in: </label>
                    <input type="datetime-local" />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">UnLoading Start: </label>
                    <input type="datetime-local" />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">UnLoading End: </label>
                    <input type="datetime-local" />
                  </div>

                  <div className="flex justify-between">
                    <label className="font-bold ">Departure: </label>
                    <input type="datetime-local" />
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
