import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios"; // Make sure to install axios if you haven't
import { useDispatch } from "react-redux";
import { selectPatient } from "../../features/selectedPatient/patientSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../../api";
import "./doctor-dashboard.css";
import io from "socket.io-client"; // Import io from socket.io-client
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const DoctorDashboard = () => {
  const [queue, setQueue] = useState([]); // State to store the queue
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = io.connect(API_URL); // Connect to the socket

  useEffect(() => {
    // Function to fetch queue data
    const fetchQueue = async () => {
      try {
        const response = await api.get("/api/queue");
        setQueue(
          response.data.map((patient) => ({
            ...patient,
            statusText:
              patient.status === "Completed"
                ? "Completed"
                : "Start Consultation",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch queue:", error);
      }
    };

    fetchQueue(); // Call the function when the component mounts
    // Setup WebSocket listener for queue updates
    socket.on("queueUpdate", () => {
      console.log("Queue update received");
      fetchQueue(); // Refetch the queue data when an update is received
    });

    // Cleanup function to remove the socket listener
    return () => {
      socket.off("queueUpdate");
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const handleStartConsultation = (patient) => {
    console.log("Starting consultation for:", patient); // Log the patient details

    // Dispatch the selectPatient action with the patient as payload
    dispatch(selectPatient(patient));
    navigate("/consultation-dashboard");
    // Additional logic for starting the consultation can be added here
  };

  return (
    <Container>
      <Typography className="title" variant="h4" component="h1">
        Consultation Dashboard
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queue.map((entry, index) => (
              <TableRow
                key={entry._id}
                style={{
                  backgroundColor:
                    entry.status === "Completed" ? "#e0e0e0" : "inherit",
                }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{entry.patientName}</TableCell>

                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStartConsultation(entry)}
                    disabled={entry.status === "Completed"}
                  >
                    {entry.statusText}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DoctorDashboard;
