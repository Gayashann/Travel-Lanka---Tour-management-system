import { FaUser } from "react-icons/fa6";

import { MdLogout } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { TiUserAdd } from "react-icons/ti";
import { MdOutlineReportProblem } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { Divider } from "@nextui-org/divider";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
const SideBar = () => {
  const [userRole, setUserRole] = useState(null);
  //   const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("authUser");
    if (!user) {
      window.location.href = "/login";
    } else {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    window.location.href = "/login";
  };
  return (
    <div className="sticky left-0 top-0 bg-gradient-to-b from-red-900 to-red-400  w-80 flex flex-col justify-between rounded-lg  shadow-lg">
      <div className="px-2">
        <Link
          to="/dashboard"
          className="flex gap-5 items-center justify-center mt-6 p-2"
        >
          <img src={logo} alt="logo" className="h-12 w-12" />
          <span>
            <h1 className="text-2xl font-semibold text-white">Travel Agency</h1>
          </span>
        </Link>
        <Divider color="white" className="text-white" />
        <div className="flex flex-col">
          {userRole === "admin" && (
            <>
              <div className="flex flex-col px-4 mt-2 gap-4 p-2 border-white">
                <NavLink
                  to="/dashboard/manage-user"
                  className={({ isActive }) =>
                    isActive
                      ? "p-2 flex gap-2 text-white transition duration-300 shadow-sm bg-rose-500 rounded-lg cursor-pointer items-center"
                      : "p-2 flex gap-2 text-red-500 transition duration-300 shadow-sm bg-white rounded-lg cursor-pointer items-center "
                  }
                >
                  <FaUser size={20} />
                  Manage Users
                </NavLink>
              </div>
              <div className="flex flex-col px-4 mt-2 gap-4 p-2 border-white">
                <NavLink
                  to="/dashboard/add-user"
                  className={({ isActive }) =>
                    isActive
                      ? "p-2 flex gap-2 text-white transition duration-300 shadow-sm bg-rose-500 rounded-lg cursor-pointer items-center"
                      : "p-2 flex gap-2 text-red-500 transition duration-300 shadow-sm bg-white rounded-lg cursor-pointer items-center "
                  }
                >
                  <TiUserAdd size={20} />
                  <span>Add User</span>
                </NavLink>
              </div>
            </>
          )}
          {(userRole === "event-manager" ||
            userRole === "admin") && (
              <>
                <div className="flex flex-col px-4 mt-2 gap-4 p-2 border-white">
                  <NavLink
                    to="/dashboard/events"
                    className={({ isActive }) =>
                      isActive
                        ? "p-2 flex gap-2 text-white transition duration-300 shadow-sm bg-rose-500 rounded-lg cursor-pointer items-center"
                        : "p-2 flex gap-2 text-red-500 transition duration-300 shadow-sm bg-white rounded-lg cursor-pointer items-center "
                    }
                  >
                    <GrUserManager size={20} />
                    <span>Event Manager</span>
                  </NavLink>
                </div>
                <div className="flex flex-col px-4 mt-2 gap-4 p-2 border-white">
                  <NavLink
                    to="/dashboard/add-event"
                    className={({ isActive }) =>
                      isActive
                        ? "p-2 flex gap-2 text-white transition duration-300 shadow-sm bg-rose-500 rounded-lg cursor-pointer items-center"
                        : "p-2 flex gap-2 text-red-500 transition duration-300 shadow-sm bg-white rounded-lg cursor-pointer items-center "
                    }
                  >
                    <MdPostAdd size={20} />
                    <span>Add Event</span>
                  </NavLink>
                </div>
              </>
            )}
          {(userRole === "inquiry-manager" ||
            userRole === "admin") && (
              <>
                <div className="flex flex-col px-4 mt-2 gap-4 p-2 border-white">
                  <NavLink
                    to="/dashboard/inquiry-list"
                    className={({ isActive }) =>
                      isActive
                        ? "p-2 flex gap-2 text-white transition duration-300 shadow-sm bg-rose-500 rounded-lg cursor-pointer items-center"
                        : "p-2 flex gap-2 text-red-500 transition duration-300 shadow-sm bg-white rounded-lg cursor-pointer items-center "
                    }
                  >
                    <MdOutlineReportProblem size={20} />
                    <span>Inquiries</span>
                  </NavLink>
                </div>
                <div className="flex flex-col px-4 mt-2 gap-4 p-2 border-white">
                  <NavLink
                    to="/dashboard/inquiry-history"
                    className={({ isActive }) =>
                      isActive
                        ? "p-2 flex gap-2 text-white transition duration-300 shadow-sm bg-rose-500 rounded-lg cursor-pointer items-center"
                        : "p-2 flex gap-2 text-red-500 transition duration-300 shadow-sm bg-white rounded-lg cursor-pointer items-center "
                    }
                  >
                    <FaHistory size={20} />
                    <span>Inquiry History</span>
                  </NavLink>
                </div>
              </>
            )}
        </div>
      </div>

      <div className="flex flex-col px-4 gap-4 p-2 border-white mb-4">
        <button
          onClick={handleLogout}
          className="p-2  flex gap-2   transition duration-300 border-white shadow-sm bg-white rounded-lg cursor-pointer items-center"
        >
          <MdLogout size={20} className="text-black font-bold" />
          <span className="ml-2 text-black font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};
export default SideBar;
