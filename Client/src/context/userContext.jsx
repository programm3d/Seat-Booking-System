import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post(
        "https://seat-booking-backendsystem.onrender.com/user/login",
        credentials
      );
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        setUser(data.user);
        setBookings(data.bookings);
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
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        setUser(data.user);
        setBookings(data.bookings);
        console.log(data);
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
