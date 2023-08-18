import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "./Alert";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  Box,
} from "@mui/material";
import AutoComplte from "./AutoComplete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import MapComponent from "./Mapcomponent";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
const OpenModal = ({ row, setOpen }) => {
  const [Chilopen, setChildOpen] = React.useState(false);

  const [Status, setStatus] = useState(false);

  const receiveDataFromChild = () => {
    setChildOpen(false);
    setStatus(true);
  };
  const [ShowMap, setShowMap] = useState(true);
  const [MapData, setMapData] = useState({
    Fromlat: "",
    Fromlong: "",
    Tolat: "",
    Tolong: "",
  });

  const LocationApi = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://nominatim.openstreetmap.org/search?q=${
        row.Data.FromCity.split(" ")[0]
      }&format=json&countrycodes=IN`,
      headers: {},
    };

    await axios
      .request(config)
      .then(async (response) => {
        const fromlat = await response.data[0].lat;
        const fromlong = await response.data[0].lon;
        setMapData((res) => ({ ...res, Fromlat: fromlat, Fromlong: fromlong }));
      })
      .catch((error) => {
        console.log(error);
      });

    let config1 = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://nominatim.openstreetmap.org/search?q=${
        row.Data.ToCity.split(" ")[0]
      }&format=json&countrycodes=IN`,
      headers: {},
    };

    await axios
      .request(config1)
      .then(async (response) => {
        const tolat = await response.data[0].lat;
        const tolong = await response.data[0].lon;
        setMapData((prevMapData) => ({
          ...prevMapData,
          Tolat: tolat,
          Tolong: tolong,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    LocationApi();
  }, []);

  const Materials = (a) => {
    if (a != null) {
      const str = "Stock and Available For Lorry Challan @ NOIDA (Saathi GC)";
      const noidaPattern = /.*\(([^)]+)\)/;
      const matches = str.match(noidaPattern);
      console.log(matches);
      if (matches) {
        var a = [19.228825, 72.854118];
        return a;
      } else {
        return a;
      }
    } else {
      return "null ";
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <>
      <div className="h-14 flex justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold">{row.Data.VehicleNo}</span>
          </div>
          <span>{row.Data.DocketNo}</span>
        </div>
        <div className="">
          <button onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className="w-full h-1 bg-gray-300"></div>
      <div className="w-full h-full flex">
        <div className="w-1/2 p-2 border-r-4 border-gray-300">
          <h1 className="text-xl text-gray-500 font-bold">
            Current Trip Point Info
          </h1>
          <br />
          <hr />
          <br />

          <div>
            <div className="flex gap-1  ">
              <div className="w-1/2 border-r-4">
                <div className="flex gap-5 hover:bg-gray-200 p-2 transition h-20 items-center">
                  <button className="bg-blue-500 rounded-full w-9 text-center p-1">
                    <HomeIcon />
                  </button>
                  <span>{row?.Data.FromCity}</span>
                </div>
                <div className="bg-gray-500 w-2 h-24 ml-5"></div>
                <div className="flex gap-5 hover:bg-gray-200 p-2 transition h-20 items-center">
                  <button className="bg-green-500 rounded-full w-9 text-center p-1">
                    <LocationOnIcon />
                  </button>
                  <span>{row?.Data.ToCity}</span>
                </div>
              </div>
              <div className=" p-3  w-full">
                <div className="p-2">
                  <span className="font-bold">EwayBill Details:</span> <br />
                  <span>
                    EwayBill Number:-{row.Data?.ewayBillNo || "no ewaybill"}
                    <br />
                    EwayBill Date:-
                    {row.Data?.ewayBillCreatedDate || "no ewaybill"}
                    <br />
                    EwayBill expiring Date :-{" "}
                    <spam className="text-red-500 font-bold  animate-pulse ">
                      {row.Data?.expiringAt || "no eway"}
                    </spam>
                    <br />
                  </span>
                </div>

                <div className="w-full border-t-4 p-2">
                  <span className="font-bold">Arrival Details:</span> <br />
                  {row?.ArrivalDataResult?.sort(
                    (a, b) =>
                      new Date(b?.ArrivalData?.ActualArrivalNo) -
                      new Date(a?.ArrivalData?.ActualArrivalNo)
                  ).map(
                    (res, index) =>
                      // Display details only for the first arrival
                      index === 0 && (
                        <React.Fragment key={res?._id}>
                          <span>
                            Arrival Date :-{" "}
                            {res?.ArrivalData?.ActualArrivalNo || "No Date"}
                          </span>
                          <br />
                          <span>
                            Arrival No :-{" "}
                            {res?.ArrivalData?.ArrivalNo || "No Number"}
                          </span>
                          <br />
                          <span>
                            No Packages :-{" "}
                            {res?.ArrivalData?.Packages || "No Packages"}
                          </span>
                          <br />
                          <span>
                            Route Name :-{" "}
                            {res?.ArrivalData?.RouteName || "No Route"}
                          </span>
                          <br />
                          <br />
                        </React.Fragment>
                      )
                  )}
                  {(!row?.ArrivalDataResult ||
                    row?.ArrivalDataResult.length === 0) && (
                    <span>No Arrival</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <br />
          <hr />
          <br />
          <div></div>
          <div className="  p-2 flex gap-3 flex-col">
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold">Trip Details:</h1>
              </AccordionSummary>
              <AccordionDetails className="bg-blue-100">
                <p>GC Number:-{row?.Data?.DocketNo}</p>
                <p>GC Date:-{row?.Data?.DocketDate}</p>
                <p>Challan Number:-{row?.Data?.THCNO}</p>
                <p>OriginLocation:-{row?.Data?.OriginLocation}</p>
                <p>DestinationLocation:-{row?.Data?.DestinationLocation}</p>
              </AccordionDetails>
            </Accordion>
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold">Arrival Details:</h1>
              </AccordionSummary>
              <AccordionDetails className="bg-yellow-100">
                {row?.ArrivalDataResult?.sort(
                  (a, b) =>
                    new Date(b?.ArrivalData?.ActualArrivalNo) -
                    new Date(a?.ArrivalData?.ActualArrivalNo)
                ).map((res) => (
                  <>
                    <span>
                      Arrival Date :-{" "}
                      {res?.ArrivalData?.ActualArrivalNo || "No Date"}
                    </span>
                    <br />
                    <span>
                      Arrival No :- {res?.ArrivalData?.ArrivalNo || "No Number"}
                    </span>
                    <br />
                    <span>
                      No Packages :-{" "}
                      {res?.ArrivalData?.Packages || "No Packages"}
                    </span>
                    <br />
                    <span>
                      Route Name :- {res?.ArrivalData?.RouteName || "No Route"}
                    </span>
                    <br />
                    <br />
                  </>
                ))}
                {(!row?.ArrivalDataResult ||
                  row?.ArrivalDataResult.length === 0) && (
                  <span>No Arrival</span>
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold">Challan Details:</h1>
              </AccordionSummary>
              <AccordionDetails className="bg-blue-100">
                <div>
                  <span>Challan No:- </span>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold">Trip Expense:</h1>
              </AccordionSummary>
              <AccordionDetails className="bg-blue-100">
                <h1>
                  <p>Vehicle Type:- {row?.Data?.Market_Own}</p>
                  <p>Total Amount:- {row?.Data?.BillAmount}</p>
                  <p>
                    Amount Left:-{" "}
                    {row?.Data?.BillAmount - row?.Data?.BillCollectedAmount}
                  </p>
                </h1>
              </AccordionDetails>
            </Accordion>
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold">Driver Details:</h1>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-col">
                  <span>
                    {row.VehicleData?.driverData?.Driver_Name || "no Driver"}
                  </span>
                  <span>
                    +91{row.VehicleData?.driverData?.Telno || "no Driver"}
                  </span>
                  <span>
                    DL No:{" "}
                    {row.VehicleData?.driverData?.License_No || "no Driver"}
                  </span>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold">Shipment Misc Fields:</h1>
              </AccordionSummary>
              <AccordionDetails className="">
                <TextField
                  id="outlined-basic"
                  label="Diesel Amount "
                  variant="outlined"
                  className="w-full text-black active:border-black"
                />
              </AccordionDetails>
            </Accordion>
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold">Custom Fields:</h1>
              </AccordionSummary>
              <AccordionDetails className="">
                <TextField
                  id="outlined-basic"
                  label="Diesel Amount "
                  variant="outlined"
                  className="w-full text-black active:border-black"
                />
              </AccordionDetails>
            </Accordion>
            <br />
          </div>
        </div>

        <div className=" w-1/2 p-2  border-gray-300 flex flex-col gap-3">
          <div>
            {!ShowMap ? (
              <button
                className="text-blue-500"
                onClick={() => setShowMap(true)}
              >
                Show Map
              </button>
            ) : (
              <button
                className="text-blue-500"
                onClick={() => setShowMap(false)}
              >
                Hide Map
              </button>
            )}

            {ShowMap && MapData.Fromlat && MapData.Fromlong ? (
              <MapComponent
                fromlat={Number(MapData.Fromlat) || 25.276987}
                fromlong={Number(MapData.Fromlong) || 55.296249}
                tolat={Number(MapData.Tolat)}
                tolong={Number(MapData.Tolong)}
                height={"400px"}
                VehicleNumber={row.veh_reg}
                Material={Materials(row.Data?.GCStatus)}
              />
            ) : (
              " Map is Loading ..."
            )}
          </div>
          <div className=" text-gray-500 p-5  flex flex-col gap-5">
            {" "}
            <h1 className="text-2xl font-bold"> Current Location </h1>
            <div>
              <button className="bg-yellow-300 w-24 text-black rounded-md h-8">
                {" "}
                Update
              </button>{" "}
              &nbsp;
              <span>TotalKms:- {row?.Data.TotalKM} kms.</span>
            </div>
            <div>
              <button
                className="bg-blue-700 w-36 rounded-md  h-8 text-white hover:bg-blue-900"
                onClick={() => setChildOpen(true)}
              >
                Update Location
              </button>
              <Modal
                open={Chilopen}
                onClose={() => setChildOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <AutoComplte status={receiveDataFromChild} />
                </Box>
              </Modal>
              &nbsp;
              <span>here will be the location showing .....</span>
            </div>
          </div>
          <div className="border text-gray-500 border-gray-500 rounded-lg h-60 p-5">
            {" "}
            <h1 className="text-xl font-bold "> Delivery Info </h1>
            <br />
            <p className="text-xl">
              <span className=" ">Status</span> :- {row?.Data?.GCStatus}
            </p>
          </div>
        </div>
      </div>
      {Status ? (
        <Alert
          error={true}
          type={"success"}
          message={"status has been updated"}
        />
      ) : null}
    </>
  );
};

export default OpenModal;
