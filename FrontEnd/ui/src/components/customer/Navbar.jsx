import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";
const Navbar = () => {
  return (
    <nav
      style={{
        marginTop: "-40px",
        background: "linear-gradient(to right, #1f3e8f, #004e92)",
      }}
      className="navbar"
    >
      <div
        style={{
          marginLeft: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          fontSize: "12px",
          gap: "10px",
        }}
        className="logo"
      >
        <img
          src={logo}
          alt="logo"
          style={{ width: "50px", height: "50px", marginBottom: "10px" }}
        />
        <Link to="/">Travel Lanka</Link>
      </div>
      <ul
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "15px",
          gap: "15px",
        }}
        className="nav-links"
      >
        <li>
          <Link to="http://localhost:3000">Home</Link>
        </li>{" "}
        <li>
          <Link to="/hotel">Hotels</Link>
        </li>
        <li>
          <Link to="/">Packagers</Link>
        </li>{" "}
        <li>
          <Link to="/vehicles">Vehicles</Link>
        </li>
        <li>
          <Link to="/viewgear">Camping Gear</Link>
        </li>
        
        <li>
          <Link to="http://localhost:3000/events">Events</Link>
        </li>
        
        <li>
          <Link to="/feedback/user">Feedback</Link>
        </li>
        <li>
          {" "}
          <Link to="http://localhost:3000/dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
