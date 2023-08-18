import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { LinearProgress, Button, Modal, Box, TextField } from "@mui/material";
import axios from "axios";
import GaadiMailkOpenModel from "./GaadiMailkOpenModel";
const GaadiMalik = () => {
  const [loading, setLoading] = useState(false);
  const [GCdata, setGCdata] = useState([]);
  const [Filter, setFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const FetchApi = () => {
    setLoading(true);
    console.log(Filter);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:5050/Vehicle/get",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const res = response.data.data.filter((item) => {
          if (Filter == "") {
            return true; // Show all items when Filter is empty
          } else {
            return item.veh_reg.includes(Filter);
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
  }, []);

  const columns = [
    {
      name: "Vehicle Info.",
      selector: (row) => row?.veh_reg,
      sortable: true,
      width: "120px",
    },
    {
      name: "Gc Count.",
      selector: (row) => row?.FinallData.length,
      sortable: true,
      width: "220px",
    },
    {
      name: "EwayBill Count.",
      selector: (row) =>
        row?.FinallData.map((ewaybill) => ewaybill.ewaybillResult.length),
      sortable: true,
      width: "220px",
      cell: (row) => {
        const ewaybillCounts = row.FinallData.map(
          (ewaybill) => ewaybill.ewaybillResult.length
        );
        const sum = ewaybillCounts.reduce((acc, count) => acc + count, 0);
        return sum;
      },
    },
    {
      name: "Arrival Count.",
      selector: (row) =>
        row?.FinallData.map((arr, keys) => arr.ArrivalDataResult.length),
      sortable: true,
      width: "220px",
      cell: (row) => {
        const arrivalCounts = row.FinallData.map(
          (arr) => arr.ArrivalDataResult.length
        );
        const sum = arrivalCounts.reduce((acc, count) => acc + count, 0);
        return sum;
      },
    },
    {
      name: "Challan Count.",
      selector: (row) =>
        row?.FinallData.map((Chall) => Chall.challanDataResult.length),
      sortable: true,
      width: "220px",
      cell: (row) => {
        const challanCounts = row.FinallData.map(
          (Chall) => Chall.challanDataResult.length
        );
        const sum = challanCounts.reduce((acc, count) => acc + count, 0);
        return sum;
      },
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
                <GaadiMailkOpenModel
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
  const searchFilteredData = GCdata.filter((row) =>
    row?.veh_reg.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div>
      {loading ? <LinearProgress /> : ""}
      <br />
      <div className="p-3">
        <TextField
          label="Search Vehicle Number"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <DataTable
          columns={columns}
          data={searchFilteredData}
          pagination
        />
      </div>
    </div>
  );
};

export default GaadiMalik;
