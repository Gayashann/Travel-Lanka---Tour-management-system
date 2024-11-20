import React from "react";
import ReactDOM from "react-dom";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

const AdminHome = () => {
  return (
    <div
      className=" relative h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          " url('https://embroiderydesigns.com.au/images/administration.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content on top of the darkened background */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Administration</h1>
        <p className="text-lg mb-6">Manage from one platform....</p>
      </div>
      
    </div>
  );
};

export default AdminHome;
