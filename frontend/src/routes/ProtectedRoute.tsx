import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false); // Local state to handle authorization

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // If no token exists, redirect to login
    if (!token) {
      navigate("/login");
      return;
    }

    // Define an async function inside useEffect
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/protectedroute", {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token stored in localStorage
          },
        });

        console.log(response.data); // Handle the response data
        setIsAuthorized(true); // Allow access if token is valid
      } catch (error) {
        console.error("Error fetching protected data", error);
        navigate("/login"); // Redirect to login if the token is invalid
      }
    };

    verifyToken(); // Call the async function
  }, [navigate]);

  // Return null or a loading spinner while the verification is in process
  if (!isAuthorized) {
    return null; // Or you can return a loading indicator here
  }

  return <>{children}</>;
};

export default ProtectedRoute;
