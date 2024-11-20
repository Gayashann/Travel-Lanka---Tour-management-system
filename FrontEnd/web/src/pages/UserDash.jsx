import { NavLink, Outlet } from "react-router-dom";

const UserDash = () => {
  const handleLogout = () => {
    localStorage.removeItem("authUser");
    window.location.href = "/login";
  };
  return (
    <div className="flex p-2 gap-2 justify-center bg-gradient-to-r from-blue-100 to-blue-300 w-full h-full">
      <div className="flex p-2 gap-2 w-[70%]">
        <div className="w-[200px]  p-2 gap-2 bg-gray-100 shadow-md flex flex-col rounded-lg max-h-[400px]">
          <div>
            <NavLink
              className={({ isActive }) =>
                `block py-2 px-3 rounded  ${
                  isActive ? "text-white font-bold bg-blue-800" : "text-black"
                } `
              }
              to="profile"
            >
              Profile
            </NavLink>
          </div>
          <div>
            <NavLink
              className={({ isActive }) =>
                `block py-2 px-3 rounded  ${
                  isActive ? "text-white font-bold bg-blue-800" : "text-black"
                } `
              }
              to="inquiry"
            >
              Inquiry
            </NavLink>
          </div>
          <div>
            <NavLink
              className={({ isActive }) =>
                `block py-2 px-3 rounded  ${
                  isActive ? "text-white font-bold bg-blue-800" : "text-black"
                } `
              }
              to="inquiry-list"
            >
              Inquiry History
            </NavLink>
          </div>
          <div onClick={handleLogout}>
            <NavLink className="block py-2 px-3 rounded text-black ">
              Logout
            </NavLink>
          </div>
        </div>
        <div className="flex-1 bg-gray-100 shadow-md flex flex-col rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default UserDash;
