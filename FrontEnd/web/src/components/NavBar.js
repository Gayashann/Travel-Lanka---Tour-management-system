import React, { useEffect } from "react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import ss from "../assets/6350271.png";

const NavBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    setUser(user);
  }, []);
  return (
    <div className="">
      <nav className="bg-gradient-to-r from-blue-900 to-blue-500 sticky w-full z-20 top-0 start-0 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={ss} className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Travel Lanka
            </span>
          </Link>
          <div className="flex justify-center items-center gap-5 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {/* <button
              type="button"
              onClick={handleLogout}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Log out
            </button> */}
            <Link to={"/profile"} className="text-white">
              <div className="flex gap-2 items-center font-bold justify-center border-2 rounded-lg shadow-md px-2 py-1">
                <img
                  src={
                    user?.profileImage ||
                    "https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-male-user-icon.png"
                  }
                  className="w-8 h-8 rounded-full object-cover"
                  alt="profile"
                />
                {user?.username.toUpperCase()}
              </div>
            </Link>
          </div>

          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded ${
                      isActive ? "text-black font-bold" : "text-white"
                    } md:hover:bg-transparent`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="http://localhost:5173/hotel"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded ${
                      isActive ? "text-black font-bold" : "text-white"
                    } md:hover:bg-transparent`
                  }
                >
                  Hotels
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="http://localhost:5173/"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded ${
                      isActive ? "text-black font-bold" : "text-white"
                    } md:hover:bg-transparent`
                  }
                >
                  Packages
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="http://localhost:5173/vehicles"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded ${
                      isActive ? "text-black font-bold" : "text-white"
                    } md:hover:bg-transparent`
                  }
                >
                  Vehicles
                </NavLink>
              </li>


              <li>
                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded ${
                      isActive ? "text-black font-bold" : "text-white"
                    } md:hover:bg-transparent`
                  }
                >
                  Events
                </NavLink>
              </li>

              
              {/* <li>
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded ${
                      isActive ? "text-black font-bold" : "text-white"
                    } md:hover:bg-transparent`
                  }
                >
                  Services
                </NavLink>
              </li> */}

              
             
           
              <li>
                <NavLink
                  to="http://localhost:5173/feedback/user"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded ${
                      isActive ? "text-black font-bold" : "text-white"
                    } md:hover:bg-transparent`
                  }
                >
                  Feedback
                </NavLink>
              </li>
              {user?.role !== "user" && (
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded ${
                        isActive ? "text-blue-700" : "text-white"
                      } md:hover:bg-transparent`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="p-5 bg-gradient-to-r from-blue-100 to-blue-300 w-full h- min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default NavBar;
