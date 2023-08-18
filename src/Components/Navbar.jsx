import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="bg-red-700 h-12 text-white font-bold flex gap-2 p-3 items-center">
      <div className="flex gap-3 ">
        <button className="hover:underline underline-offset-4 transition-all delay-1000">
          <Link to="/">Home</Link>
        </button>
        <button className="hover:underline underline-offset-4 transition-all delay-1000">
          <Link to="/placeandroutes">Place & Routes</Link>
        </button>
        <button className="hover:underline underline-offset-4 transition-all delay-1000">
          <Link to="/gaadimalik">Gaadi Malik</Link>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
