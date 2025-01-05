import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/protectedroute", {
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
