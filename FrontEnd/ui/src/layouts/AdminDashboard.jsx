import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

const AdminDashboardLayout = () => {
  return (
    <div className="flex w-screen min-h-screen bg-[#eef3fd] p-2 ">
      <SideBar />
      <div className="flex flex-col w-full pl-3  gap-4">
        <div className="flex-grow  bg-gradient-to-r from-red-100 to-red-300  rounded-lg shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardLayout;
