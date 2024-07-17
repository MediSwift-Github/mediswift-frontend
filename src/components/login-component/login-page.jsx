import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import "./login-page.css";
import logo from "./MediSwift.png";
import api from "../../api";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { setHospitalId } from '../../features/selectHospital/hospitalSlice';
import {useDispatch} from "react-redux";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Moved useDispatch to the top-level of the component

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/api/login", { username, password });
      if (response.data.message === "Authentication successful") {
        const { token, role } = response.data;
        localStorage.setItem("jwtToken", token);

        if (token) {
          const decodedToken = jwtDecode(token);
          const hospitalId = decodedToken.hospital_id;
          dispatch(setHospitalId(hospitalId));  // Dispatch the action to set hospitalId

          if (role === "doctor") {
            navigate("/doctor-dashboard");
          } else if (role === "receptionist") {
            navigate("/frontdesk-dashboard");
          } else {
            console.log("User role not recognized or user does not have permissions.");
          }
        } else {
          console.log("Token is invalid or undefined");
        }
      } else {
        alert("Authentication failed. Please try again.");
      }
    } catch (error) {
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
