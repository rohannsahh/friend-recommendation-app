import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false); 
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/protectedroute`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        console.log(response.data); 
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error fetching protected data", error);
        navigate("/login"); 
      }
    };

    verifyToken();
  }, [navigate]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
