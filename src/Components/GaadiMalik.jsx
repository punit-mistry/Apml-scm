import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  LinearProgress,
  Button,
  Modal,
  Box,
  TextField,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import GaadiMailkOpenModel from "./GaadiMailkOpenModel";

const GaadiMalik = () => {
  const [loading, setLoading] = useState(false);
  const [GCdata, setGCdata] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const Type = [
    { title: "All" },
    { title: "Intransit" },
    { title: "AtPickup" },
    { title: "At Unloading" },
    { title: "Available" },
    { title: "Off duty" },
  ];
  const fetchData = () => {
    setLoading(true);
    const apiUrl = "http://localhost:5050/Vehicle/get";

    axios
      .get(apiUrl)
      .then((response) => {
        const data = response.data.data;
        setGCdata(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
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
  const UpdateButton = ({ row }) => {
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
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const filteredData = GCdata.filter((row) => {
    const vehicleStatus = row?.VehicleStatus;
    const regMatch = row?.veh_reg
      .toLowerCase()
      .includes(searchInput.toLowerCase());
    const statusMatch =
      selectedStatus === "All" ||
      (vehicleStatus &&
        vehicleStatus.toLowerCase() === selectedStatus.toLowerCase());

    return regMatch && statusMatch;
  });

  return (
    <div>
      <div className="flex h-10 m-3 font-bold">
        {Type.map((res) => (
          <button
            key={res.title}
            className={`hover:bg-slate-200 p-2 h-10 hover:border-b-2 border-blue-950 text-lg uppercase ${
              selectedStatus === res.title ? "bg-slate-200" : ""
            }`}
            onClick={() => handleStatusFilter(res.title)}
          >
            {res.title}
          </button>
        ))}
      </div>
      {loading ? <LinearProgress /> : ""}

      <div className="p-3">
        <TextField
          label="Search Vehicle Number"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
        />
      </div>
    </div>
  );
};

export default GaadiMalik;
