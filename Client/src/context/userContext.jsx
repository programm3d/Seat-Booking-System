import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      axios
        .get("https://seat-booking-backendsystem.onrender.com/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }) => {
          setUser({ token, ...data.user }); 
          setBookings(data.bookings);
          navigate("/");
        })
        .catch((error) => {
          console.error(
            "❌ Auto-login failed:",
            error.response?.data || error.message
          );
          localStorage.removeItem("jwt");
          navigate("/login"); 
        });
    }
  }, [navigate]); 

  const login = async (credentials) => {
    try {
      const { data } = await axios.post(
        "https://seat-booking-backendsystem.onrender.com/user/login",
        credentials
      );

      if (data.token) {
        localStorage.setItem("jwt", data.token);
        setUser({ token: data.token, ...data.user });
        setBookings(data.bookings);
        console.log("✅ Login Successful:", data);

        navigate("/"); 
      }
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
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
      console.error("❌ Signup error:", error.response?.data || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setBookings([]);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, bookings, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
