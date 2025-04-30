import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      const { data } = await axios.post(
        "https://seat-booking-backendsystem.onrender.com/user/login",
        credentials
      );

      if (data.token) {
        localStorage.setItem("jwt", data.token);
        const userData = { token: data.token, bookings: data.bookings };
        setUser(userData);
        setBookings(data.bookings);
        console.log(data, user);
        navigate("/"); 
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  const signup = async (userInfo) => {
    try {
      const { data } = await axios.post(
        "https://seat-booking-backendsystem.onrender.com/user/sign-up",
        userInfo
      );
      if (data) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setBookings([]);
  };

  return (
    <UserContext.Provider value={{ user, bookings, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
