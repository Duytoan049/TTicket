import { useState } from "react";
import Admin from "./Admin";
import ManageMovie from "./ManageMovie";
import MoviesSystem from "./MoviesSystem";
import { Link } from "react-router-dom";
const AdminManage = () => {
  const [activeManagement, setActiveManagement] = useState("user");

  return (
    <div className="flex flex-row bg-white font-custom_semi min-h-screen max-h-full">
      <div className="flex flex-col pt-10 bg-gray-100 w-[15%]">
        <Link to={`/`}>
          <button className="pl-5 pb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1.5em"
              viewBox="0 0 12 24"
            >
              <path
                fill="black"
                fillRule="evenodd"
                d="M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5L10 4.563L2.682 12z"
              ></path>
            </svg>
          </button>
        </Link>
        <p className="font-custom_bold text-gray-600 pb-5 pl-5">
          Admin Management
        </p>
        <div className="w-full flex items-center flex-col space-y-1">
          <button
            className={`w-[95%] px-4 py-2 rounded-lg text-black text-left hover:bg-gray-300 ${
              activeManagement === "user" ? "bg-gray-400" : ""
            }`}
            onClick={() => setActiveManagement("user")}
          >
            User Management
          </button>
          <button
            className={`w-[95%] px-4 py-2 rounded-lg text-black text-left hover:bg-gray-300 ${
              activeManagement === "movie" ? "bg-gray-400" : ""
            }`}
            onClick={() => setActiveManagement("movie")}
          >
            Movie Management (API)
          </button>
          <button
            className={`w-[95%] px-4 py-2 rounded-lg text-black text-left hover:bg-gray-300 ${
              activeManagement === "moviesystem" ? "bg-gray-400" : ""
            }`}
            onClick={() => setActiveManagement("moviesystem")}
          >
            Movie Management (System)
          </button>
        </div>
      </div>
      <div className="w-[0.9px] bg-[#C4C4C7]"></div>
      <div className="w-[85%] bg-[#F9F9FC] text-black">
        {activeManagement === "user" && <Admin />}
        {activeManagement === "movie" && <ManageMovie />}
        {activeManagement === "moviesystem" && <MoviesSystem />}
      </div>
    </div>
  );
};

export default AdminManage;
