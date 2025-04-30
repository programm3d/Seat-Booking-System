import { Navigate } from "react-router-dom";
import { useUser } from "./context/userContext";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwt");

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
