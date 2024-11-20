import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRequired = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse authUser from localStorage", error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === "user") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AuthRequired;
