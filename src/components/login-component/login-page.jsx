import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import "./login-page.css";
import logo from "./MediSwift.png";
import api from "../../api";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post(
        "/api/login",
        { username, password },
        { withCredentials: true }
      );
      // This will give you token
      // console.log("response.token");
      if (response.data.message === "Authentication successful") {
        // Check the role and navigate accordingly
        if (response.data.role === "doctor") {
          navigate("/doctor-dashboard");
        } else if (response.data.role === "receptionist") {
          navigate("/frontdesk-dashboard");
        } else {
          // Handle other roles or default case
          // console.log(
          //   "User role not recognized or user does not have permissions."
          // );
        }
      } else {
        alert("Authentication failed. Please try again.");
      }
    } catch (error) {
      // console.error("Login error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // console.log("username---->>", username);

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="logo" />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <TextField
            label="Username"
            variant="outlined"
            required
            value={username ? username : null}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
            value={password ? password : null}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
