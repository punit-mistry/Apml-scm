import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
const GaadiMailkOpenModel = ({ row, setOpen, GCdata }) => {
  const [Data, setData] = useState({
    EwayBill: [],
    Challan: [],
    Arrival: [],
  });

  const SortData = () => {
    const Arrivalres = row.FinallData.map((res) => res.ArrivalDataResult);
    const Ewaybillres = row.FinallData.map((res) => res.ewaybillResult);
    const Challanres = row.FinallData.map((res) => res.challanDataResult);
    setData({
      ...Data,
      EwayBill: Ewaybillres,
      Challan: Challanres,
      Arrival: Arrivalres,
    });
  };

  useEffect(() => {
    SortData();
  }, []);

  return (
    <div className="h-14 flex justify-between flex-col">
      <div className="flex justify-between items-center w-full border-b-4">
        <div>
          <span className="font-bold">{row?.veh_reg}</span>
        </div>
        <div>
          <button onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className=" w-full flex p-3 ">
        <div className="w-1/2  border-r-4">
          <div className="h-96 p-3 border-b-4 overflow-scroll">
            <span>
              <span className="font-bold"> All GC :-</span>
              {row.FinallData.length > 0 ? (
                row.FinallData.map((res) => (
                  <div key={res}>
                    <li>{res.Data.DocketNo}</li>
                  </div>
                ))
              ) : (
                <span>No Docket Numbers</span>
              )}
            </span>
            <span>
              <span className="font-bold"> All Arrival:-</span>

              {Data.Arrival.map((res) =>
                res.length > 0 ? (
                  res.map((row) => <li>{row.ArrivalData.ActualArrivalNo}</li>)
                ) : (
                  <li>No Arrival</li>
                )
              )}
            </span>
            <span>
              <span className="font-bold"> All EwayBill:-</span>
              {Data.EwayBill.map((res) =>
                res.length > 0 ? (
                  res.map((row) => <li>{row.data.ewayBillNo}</li>)
                ) : (
                  <li>No Ewaybill</li>
                )
              )}
            </span>
            <span>
              <span className="font-bold"> All Challan :-</span>
              {Data.Challan.map((res) =>
                res.length > 0 ? (
                  res.map((row) => <li>{row.ChallanData.THCNO}</li>)
                ) : (
                  <li>No Challan</li>
                )
              )}
            </span>
          </div>
          <div className=" h-96 p-3">this is Div 2</div>
        </div>
        <div className="p-3">this is the Div 3</div>
      </div>
    </div>
  );
};

export default GaadiMailkOpenModel;
