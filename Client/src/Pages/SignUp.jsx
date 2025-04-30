import React, { useState } from "react";
import { useUser } from "../context/userContext";
import "../App.css";

const SignUp = () => {
  const { signup } = useUser();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signup(userInfo);
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setUserInfo({ ...userInfo, password: e.target.value })
          }
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? Please <Link to="/login">Login</Link>.</p>
    </div>
  );
};

export default SignUp;
