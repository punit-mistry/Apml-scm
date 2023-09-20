import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "./Alert";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  Box,
  CircularProgress,
} from "@mui/material";
import QRCode from "qrcode.react";
import AutoComplte from "./AutoComplete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import MapComponent from "./Mapcomponent";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import WhatsAppSender from "./WhatsappSender";
import uuid from "react-uuid";
import VehicleUpdate from "./VehicleUpdate";
const GaadiMailkOpenModel = ({ row, setOpen }) => {
  const [CombineData, setData] = useState({
    EwayBill: [],
    Challan: [],
    Arrival: [],
  });

  const SortData = () => {
    const Arrivalres = row.FinallData.map((res) => res.ArrivalDataResult);
    const Ewaybillres = row.FinallData.map((res) => res.ewaybillResult);
    const Challanres = row.FinallData.map((res) => res.challanDataResult);
    setData({
      ...CombineData,
      EwayBill: Ewaybillres,
      Challan: Challanres,
      Arrival: Arrivalres,
    });
  };

  useEffect(() => {
    SortData();
  }, []);
  const [Chilopen, setChildOpen] = React.useState(false);
  const [JkData, setJkData] = useState([]);
  const [AllChats, setAllChats] = useState([]);
  const [QrData, setQrData] = useState("");
  const [LoadQrData, setLoadQrData] = useState(false);
  const [Status, setStatus] = useState(false);
  const [ShowChats, setShowChats] = useState(false);

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
        row.FinallData[0].Data.FromCity.split(" ")[0]
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
        row.FinallData[0].Data.ToCity.split(" ")[0]
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

  const JkTyreFetch = async () => {
    const response = await axios.get(
      `http://localhost:5050/JKTyre?filter={"vehicle": "${row.FinallData[0].Data.VehicleNo}"}`
    );
    setJkData(response.data.data);
  };

  const QrCodeFetch = async () => {
    try {
      setLoadQrData(true);
      const response = await axios.get("http://localhost:3000/qrcode");
      console.log(response.data);
      if (response.data.qrCodeData) {
        setLoadQrData(false);
        setQrData(response.data.qrCodeData);
      } else {
        setLoadQrData(false);
      }
    } catch (e) {
      console.log(e.message);
      setLoadQrData(false);
    }
  };

  const FetchAllChats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/chat/messages/917718959200@c.us"
      );
      console.log(response.data);
      setAllChats(response.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    LocationApi();
    JkTyreFetch();
    QrCodeFetch();
    FetchAllChats();
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

  const UpdateTheStatus = async () => {
    let data = JSON.stringify({
      VehicleNumber: row.FinallData[0].Data.VehicleNo,
      VehicleStatus: "AtPickup",
      uuid: uuid(),
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `http://localhost:5050/gc/update/${row._id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        alert("success");
      })
      .catch((error) => {
        console.log(error);
      });
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
    // <>{JSON.stringify(CombineData)}</>
    <>
      <div className="h-14 flex justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {row.FinallData[0].Data.VehicleNo}
            </span>
          </div>
          <span>{row.FinallData[0].Data.DocketNo}</span>
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
          <div className="flex justify-between">
            <h1 className="text-xl text-gray-500 font-bold">
              Current Trip Point Info
            </h1>
            {!ShowChats && (
              <button
                onClick={() => setShowChats(!ShowChats)}
                className="bg-blue-600 font-bold text-white p-2 rounded-lg"
              >
                {" "}
                Show Chats{" "}
              </button>
            )}
            {ShowChats && (
              <button
                onClick={() => setShowChats(!ShowChats)}
                className="bg-red-600 font-bold text-white p-2 rounded-lg"
              >
                {" "}
                Hide Chats{" "}
              </button>
            )}
          </div>
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
                  <span>{row?.FinallData[0].Data.FromCity}</span>
                </div>
                <div className="bg-gray-500 w-2 h-24 ml-5"></div>
                <div className="flex gap-5 hover:bg-gray-200 p-2 transition h-20 items-center">
                  <button className="bg-green-500 rounded-full w-9 text-center p-1">
                    <LocationOnIcon />
                  </button>
                  <span>{row?.FinallData[0].Data.ToCity}</span>
                </div>
              </div>
              <div className=" p-3  w-full">
                <div className="p-2">
                  <span className="font-bold">EwayBill Details: </span> <br />
                  <span>
                    <div className="flex items-center">
                      EwayBill Number:-
                      <textarea
                        value={CombineData.EwayBill.filter(
                          (res) => res.length > 0
                        ).flatMap((res) =>
                          res.map((data) => data.data.ewayBillNo).join("\n")
                        )}
                      ></textarea>
                    </div>
                    <br />
                    <div className="flex items-center">
                      EwayBill Date:-
                      <textarea
                        className="w-[12vw]"
                        value={CombineData.EwayBill.filter(
                          (res) => res.length > 0
                        ).flatMap((res) =>
                          res
                            .map((data) => data.data.ewayBillCreatedDate)
                            .join("\n")
                        )}
                      ></textarea>
                    </div>
                    <br />

                    <div className="flex items-center">
                      EwayBill expiring Date :-
                      <textarea
                        className="w-[12vw]"
                        value={CombineData.EwayBill.filter(
                          (res) => res.length > 0
                        ).flatMap((res) =>
                          res.map((data) => data.data.expiringAt).join("\n")
                        )}
                      ></textarea>
                    </div>
                    <br />
                  </span>
                </div>

                {/* <div className="w-full border-t-4 p-2">
                  <span className="font-bold">Arrival Details:</span> <br />  
                  {CombineData.Arrival?.sort(
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
                </div> */}
              </div>
            </div>
          </div>
          <br />
          <hr />
          <br />
          <div></div>
          <div className="  p-2 flex gap-3 flex-col">
            {JkData.length > 0 && (
              <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h1 className="text-lg font-bold">JKTyre Details:</h1>
                </AccordionSummary>
                <AccordionDetails className=" flex justify-center items-center text-center">
                  <table className="w-[40vw] ">
                    <tr className="border border-black">
                      <th className="border border-black">Last Inspe.</th>
                      <th className="border border-black">Location</th>
                      <th className="border border-black">
                        No. Tyre / Tyre No
                      </th>
                      <th className="border border-black">Postion </th>
                      <th className="border border-black">Due.</th>
                    </tr>
                    {JkData.map((res) => {
                      return (
                        <tr
                          className={`border border-black ${
                            new Date(res.inspectionDate)
                              .toISOString()
                              .split("T")[0] >=
                            new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // 30 days in milliseconds
                              .toISOString()
                              .split("T")[0]
                              ? "bg-red-600 text-white"
                              : ""
                          }`}
                        >
                          <td className="border border-black p-1">
                            {
                              new Date(res.inspectionDate)
                                .toISOString()
                                .split("T")[0]
                            }
                          </td>
                          <td className="border border-black p-1">{res.hub}</td>

                          <td className="border border-black">
                            {res.inspectedTyres.map((res, key) => {
                              return (
                                <>
                                  {`⚙️${key}:${res.pressure} :: ${res.stencilNo}`}
                                  <br />
                                </>
                              );
                            })}
                          </td>
                          <td className="border border-black">
                            {res.inspectedTyres.map((res, key) => {
                              return (
                                <>
                                  {`${res.position} `}
                                  <br />
                                </>
                              );
                            })}
                          </td>
                          <td className={`animate-pulse font-bold }`}>
                            {calculateDateDifference(res.inspectionDate)}
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </AccordionDetails>
              </Accordion>
            )}
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold">Trip Details:</h1>
              </AccordionSummary>
              <AccordionDetails className="bg-blue-100">
                <p>GC Number:-{row?.FinallData[0].Data?.DocketNo}</p>
                <p>GC Date:-{row?.FinallData[0].Data?.DocketDate}</p>
                <p>Challan Number:-{row?.FinallData[0].Data?.THCNO}</p>
                <p>OriginLocation:-{row?.FinallData[0].Data?.OriginLocation}</p>
                <p>
                  DestinationLocation:-
                  {row?.FinallData[0].Data?.DestinationLocation}
                </p>
              </AccordionDetails>
            </Accordion>
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold">Arrival Details: </h1>
              </AccordionSummary>
              {/* <AccordionDetails className="bg-yellow-100">
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
              </AccordionDetails> */}
              <AccordionDetails className="bg-yellow-100">
                {CombineData.Arrival?.filter((res) => res.length > 0).flatMap(
                  (res) =>
                    res
                      .sort(
                        (a, b) =>
                          new Date(b.ArrivalData.ActualArrivalNo) -
                          new Date(a.ArrivalData.ActualArrivalNo)
                      )
                      .map((res) => (
                        <React.Fragment key={res.id}>
                          <span>
                            Arrival Date :-{" "}
                            {new Date(
                              res.ArrivalData.ActualArrivalNo
                            ).toLocaleString() || "No Date"}
                          </span>
                          <br />
                          <span>
                            Arrival No :-{" "}
                            {res.ArrivalData.ArrivalNo || "No Number"}
                          </span>
                          <br />
                          <span>
                            No Packages :-{" "}
                            {res.ArrivalData.Packages || "No Packages"}
                          </span>
                          <br />
                          <span>
                            Route Name :-{" "}
                            {res.ArrivalData.RouteName || "No Route"}
                          </span>
                          <br />
                          <br />
                        </React.Fragment>
                      ))
                )}
                {!CombineData.Arrival ||
                  (CombineData.Arrival.length === 0 && <span>No Arrival</span>)}
              </AccordionDetails>
            </Accordion>
            <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h1 className="text-lg font-bold">
                  Challan Details:
                  {CombineData.Challan?.filter((Res) => Res.length > 0).flatMap(
                    (res) => res.length
                  )}
                </h1>
              </AccordionSummary>
              <AccordionDetails className="bg-yellow-100">
                {CombineData.Challan?.filter((Res) => Res.length > 0).flatMap(
                  (res) =>
                    res.map((res) => (
                      <React.Fragment key={res.id}>
                        <span>
                          THCDate Date :- {res.ChallanData.THCDate || "No Date"}
                        </span>
                        <br />
                        <span>
                          FromCity :- {res.ChallanData.FromCity || "No Number"}
                        </span>
                        <br />
                        <span>
                          ToCity :- {res.ChallanData.ToCity || "No Packages"}
                        </span>
                        <br />
                        <span>
                          Route Name :-{" "}
                          {res.ChallanData.RouteName || "No Route"}
                        </span>{" "}
                        <br />
                        <span>
                          MarketOwn :- {res.ChallanData.MarketOwn || "No Route"}
                        </span>
                        <br /> <div className="border-b-2 border-black" />
                      </React.Fragment>
                    ))
                )}
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
                  <p>Vehicle Type:- {row?.FinallData[0].Data?.Market_Own}</p>
                  <p>Total Amount:- {row?.FinallData[0].Data?.BillAmount}</p>
                  <p>
                    Amount Left:-{" "}
                    {row?.FinallData[0].Data?.BillAmount -
                      row?.FinallData[0].Data?.BillCollectedAmount}
                  </p>
                </h1>
              </AccordionDetails>
            </Accordion>
            {/* <Accordion className="bg-blue-100 border-2 border-gray-600 rounded-lg">
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
            </Accordion> */}
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
        <div></div>
        {ShowChats && (
          <div>
            <div className="bg-green-950 text-white font-bold w-[45vw] h-[80vh]">
              {AllChats.length > 0 &&
                AllChats.map((res) => {
                  return (
                    <>
                      <div className="flex flex-col ">
                        <div
                          className={`${
                            res.FromMe ? "text-right" : "text-left "
                          } mt-3 mr-3 ml-3`}
                        >
                          <span
                            className={`${
                              res.FromMe
                                ? "text-right bg-green-700"
                                : "text-left bg-slate-500 "
                            } p-1  rounded-lg rounded-br-none`}
                          >
                            {res.content}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        )}
        {!ShowChats && (
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
                  Material={Materials(row.FinallData[0].Data?.GCStatus)}
                />
              ) : (
                " Map is Loading ..."
              )}
            </div>
            <div className=" text-gray-500 p-5  flex flex-col gap-5">
              {" "}
              <h1 className="text-2xl font-bold"> Current Location </h1>
              <div className="flex gap-5">
                {LoadQrData && <CircularProgress />}

                {!LoadQrData && QrData != "" && <QRCode value={QrData} />}

                {!LoadQrData && QrData == "" && (
                  <WhatsAppSender
                    DriverNumber={
                      row.VehicleData?.driverData?.Telno || "7718959200"
                    }
                  />
                )}
              </div>
              <div>
                <button className="bg-yellow-300 w-24 text-black rounded-md h-8">
                  {" "}
                  Update
                </button>{" "}
                &nbsp;
                <span>TotalKms:- {row?.FinallData[0].Data.TotalKM} kms.</span>
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
            {!row.VehicleStatus && (
              <button
                className="bg-blue-600 h-10 font-bold text-white rounded-lg "
                onClick={UpdateTheStatus}
              >
                Update the Status
              </button>
            )}

            <VehicleUpdate
              status={row.VehicleStatus}
              row={row}
            />
            <br />
          </div>
        )}
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

export default GaadiMailkOpenModel;

function calculateDateDifference(inspectionDate) {
  const currentDate = new Date();
  const inspectionDateObj = new Date(inspectionDate);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = currentDate - inspectionDateObj;

  // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const differenceInDays = differenceInMilliseconds / (24 * 60 * 60 * 1000);

  // Round the difference to the nearest whole number
  return Math.round(differenceInDays);
}
