import React, { useState } from "react";
import { useUser } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Login = () => {
  const { login } = useUser();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        No account? Please <Link to="/signup">Sign-Up</Link>.
      </p>
    </div>
  );
};

export default Login;
