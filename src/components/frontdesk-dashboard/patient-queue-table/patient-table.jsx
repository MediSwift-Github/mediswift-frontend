import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios"; // Make sure to install axios if you haven't
import io from "socket.io-client";
import api from "../../../api";
import {useSelector} from "react-redux";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const socket = io.connect(API_URL);

export const PatientTable = () => {
  // State to store the fetched data
  const [rows, setRows] = useState([]);
  const hospitalId = useSelector((state) => state.hospital.hospitalId); // Get hospitalId from Redux state

  useEffect(() => {
    // Function to fetch data from the endpoint
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/queue?hospitalId=${hospitalId}`); // Include hospitalId in the query
        const queueData = response.data.map((entry) => ({
          id: entry._id,
          name: entry.patientName,
          mobileNumber: entry.patientMobileNumber,
          status: entry.status,
          queueEntryTime: new Date(entry.queueEntryTime)  // Ensure you have the entry time
        }));

        // Sort data: 'Chatting' entries first, then by time, followed by 'Completed'
        queueData.sort((a, b) => {
          if (a.status === b.status) {
            return a.queueEntryTime - b.queueEntryTime;  // Sort by time if the status is the same
          }
          return a.status === "Chatting" ? -1 : 1;  // Prioritize 'Chatting' over 'Completed'
        });

        console.log(queueData);
        setRows(queueData);
      } catch (error) {
        console.error("Failed to fetch queue entries:", error);
      }
    };

    fetchData();

    // Setup WebSocket listener for queue updates
    socket.on("queueUpdate", (update) => {
      // console.log("Queue update received:", update);
      // Optionally, fetch the updated data or adjust the state based on the update
      // For simplicity, we're just refetching the queue data here
      fetchData();
    });

    // Cleanup on component unmount
    return () => {
      socket.off("queueUpdate");
    };
  }, [hospitalId]); // Include hospitalId as a dependency to refetch data when it changes

  return (
    // <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Serial Number</TableCell>
          <TableCell>Patient Name</TableCell>
          <TableCell>Mobile Number</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow
            key={row.id}
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
              backgroundColor:
                row.status === "Completed" ? "#e0e0e0" : "inherit", // Grey out if completed
            }}
          >
            <TableCell
              component="th"
              scope="row"
              style={{ marginLeft: "15px", padding: "16px 16px 16px 30px" }}
            >
              {index + 1} {/* Here we use the index for the serial number */}
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.mobileNumber}</TableCell>
            <TableCell>
              <Button variant="outlined" disabled={row.status === "Completed"}>
                {row.status}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    // </TableContainer>
  );
};
