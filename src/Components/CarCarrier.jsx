import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import OpenModal from "./OpenModel";
import { LinearProgress } from "@mui/material";
import { Box, Button, Modal, Autocomplete, TextField } from "@mui/material/";
const CarCarrier = () => {
  const [GCdata, setGCdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Filter, setFilter] = useState([]);
  const FetchApi = () => {
    setLoading(true);
    console.log(Filter);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: 'http://localhost:5050/gc/get?filter={"FetchDate":"Aug-2023"}',
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const res = response.data.data.filter((item) => {
          if (Filter.length === 0) {
            return true; // Show all items when Filter is empty
          } else {
            return Filter.some(
              (filterItem) => filterItem.title === item.Data.IsNewPortal
            );
          }
        });
        setGCdata(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    FetchApi();
  }, [Filter]);

  const columns = [
    {
      name: "Vehicle Info.",
      selector: (row) => row?.Data.DocketNo,
      sortable: true,
      width: "120px",
    },
    {
      name: "Type.",
      selector: (row) => row?.Data.IsNewPortal,
      sortable: true,
      width: "120px",
    },
    {
      name: "status",
      selector: (row) => {
        const statusCheck = (a) => {
          if (a !== null) {
            // Extract the status
            const intransit = /In Transit/i; // Case-insensitive search
            const statusMatch = a.match(intransit);
            const Pod = /POD Uploaded/i;
            const PodMatch = a.match(Pod);
            const gc_completion = /GC completion/i;
            const gcCompleted = a.match(gc_completion);
            const Stock = /Stock/i;
            const Available = a.match(Stock);
            if (statusMatch) {
              return statusMatch[0];
            } else if (PodMatch) {
              return "Pod Uploaded";
            } else if (gcCompleted) {
              return "GC completed Available ";
            } else if (Available) {
              return "Available";
            } else {
              return a;
            }
          } else {
            return "null ";
          }
        };
        return <>{statusCheck(row?.Data.GCStatus)}</>;
      },
      sortable: true,
      width: "400px",
    },
    {
      name: "Vehicle Number",
      selector: (row) => {
        const vehicleCount = (a) => {
          if (a) {
            return a;
          } else {
            return "No vehicle";
          }
        };
        return <>{vehicleCount(row?.Data.VehicleNo)}</>;
      },
      width: "150px",
      sortable: true,
    },
    {
      name: "Arrival Count",
      selector: (row) => row?.ArrivalDataResult.length || "0",
      sortable: true,
      width: "120px",
    },
    {
      name: "From City",
      selector: (row) => row?.Data?.FromCity,
      sortable: true,
      width: "120px",
    },
    {
      name: "TO City",
      selector: (row) => row?.Data?.ToCity,
      sortable: true,
      width: "120px",
    },
    {
      name: "Eway bill",
      selector: (row) => row.Data?.ewayBillNo || "no ewaybill",
      sortable: true,
      width: "120px",
    },
    {
      name: "Total Days",
      selector: (row) => {
        const calculate = (a) => {
          if (a.BookingType == "FTL") {
            return Math.round(a.TotalKM / 250);
          } else if (a.BookingType == "LTL(SUNDRY)") {
            return Math.round(a.TotalKM / 100);
          } else {
            return "No";
          }
        };
        return (
          <>
            <span>{calculate(row.Data)}</span>
          </>
        );
      },
      sortable: true,
      width: "120px",
    },
    {
      name: "Gc Date",
      selector: (row) => row.Data?.DocketDate.split("T")[0] || null,
      sortable: true,
      width: "120px",
    },
    {
      name: "updated GC Date",
      selector: (row) => {
        const calculate = (a) => {
          if (a.BookingType === "FTL") {
            var daysToAdd = Math.round(a.TotalKM / 250);
            var originalDate = new Date(a.DocketDate);
            originalDate.setDate(originalDate.getDate() + daysToAdd);

            var day = originalDate.getDate();
            var month = originalDate.getMonth() + 1; // Months are zero-based
            var year = originalDate.getFullYear();

            var formattedDate = `${day < 10 ? "0" : ""}${day}-${
              month < 10 ? "0" : ""
            }${month}-${year}`;

            return formattedDate;
          } else if (a.BookingType === "LTL(SUNDRY)") {
            var daysToAdd = Math.round(a.TotalKM / 100);
            var originalDate = new Date(a.DocketDate);
            originalDate.setDate(originalDate.getDate() + daysToAdd);

            var day = originalDate.getDate();
            var month = originalDate.getMonth() + 1; // Months are zero-based
            var year = originalDate.getFullYear();

            var formattedDate = `${day < 10 ? "0" : ""}${day}-${
              month < 10 ? "0" : ""
            }${month}-${year}`;

            return formattedDate;

            return daysToAdd;
          } else {
            return "No";
          }
        };
        return (
          <>
            <span>{calculate(row.Data)}</span>
          </>
        );
      },
      sortable: true,
      width: "120px",
    },
    {
      name: "Part Load ",
      selector: (row) => row.Data?.BookingType || "no ewaybill",
      sortable: true,
      width: "120px",
    },
    {
      name: "Update",
      selector: (row) => {
        const style = {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
        };
        const [open, setOpen] = useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);
        return (
          <div>
            <Button onClick={handleOpen}>Update</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={style}
                className="w-[97vw] h-full m-3 p-5 overflow-auto"
              >
                <OpenModal
                  row={row}
                  setOpen={setOpen}
                />
              </Box>
            </Modal>
          </div>
        );
      },
      sortable: true,
      width: "120px",
    },
  ];

  const Type = [{ title: "Commercial" }, { title: "HHG" }, { title: "CAR" }];
  return (
    <div>
      {loading ? <LinearProgress /> : ""}
      <br />
      <div className="p-3">
        <Autocomplete
          multiple
          limitTags={2}
          id="multiple-limit-tags"
          options={Type}
          getOptionLabel={(option) => option.title}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Status"
              placeholder="Status"
            />
          )}
          onChange={(event, newValue) => {
            setFilter(newValue);
          }}
          sx={{ width: "500px" }}
        />
      </div>
      <DataTable
        columns={columns}
        data={GCdata}
        pagination
      />
    </div>
  );
};

export default CarCarrier;
