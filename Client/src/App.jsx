import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { useUser } from "./context/userContext";

function App() {
  const { user } = useUser(); // Get authentication state

  return (
    <Routes>
      {/* Redirect to Home if user is logged in, otherwise go to Login */}
      <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />

      <Route
        path="/login"
        element={user ? <Navigate to="/home" /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/home" /> : <SignUp />}
      />
      <Route
        path="/home"
        element={user ? <Home /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
