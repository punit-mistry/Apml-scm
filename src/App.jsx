import React from "react";
import { Route, Routes } from "react-router-dom";
import CarCarrier from "./Components/CarCarrier";
import Navbar from "./Components/Navbar";
import PlaceandRoutes from "./Components/PlaceandRoutes";
import GaadiMalik from "./Components/GaadiMalik";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<CarCarrier />}
        ></Route>
        <Route
          path="/placeandroutes"
          element={<PlaceandRoutes />}
        ></Route>
        <Route
          path="/gaadimalik"
          element={<GaadiMalik />}
        ></Route>
      </Routes>
    </>
  );
};

export default App;
