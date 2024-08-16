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
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios"; // Make sure to install axios if you haven't
import {useDispatch, useSelector} from "react-redux";
import { selectPatient } from "../../features/selectedPatient/patientSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../../api";
import "./doctor-dashboard.css";
import io from "socket.io-client"; // Import io from socket.io-client
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const ITEM_HEIGHT = 48;

const DoctorDashboard = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [queue, setQueue] = useState([]); // State to store the queue
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = io(API_URL, { autoConnect: false }); // Initialize the socket with autoConnect set to false
  const location = useLocation();
  const [anchorEls, setAnchorEls] = useState({});
  const hospitalId = useSelector((state) => state.hospital.hospitalId); // Get hospitalId from Redux store

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const controlNavbar = () => {
    if (window.scrollY > 10) {
      if (window.scrollY > lastScrollY) {
        setShow("hide");
      } else {
        setShow("stickyTableHead");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

    const handleClick = (event, patientId) => {
        setAnchorEls((prev) => ({ ...prev, [patientId]: event.currentTarget }));
    };
    const handleClose = (patientId) => {
        setAnchorEls((prev) => ({ ...prev, [patientId]: null }));
    };

  useEffect(() => {
      socket.connect(); // Connect the socket

      // Function to fetch queue data
      const fetchQueue = async () => {
          try {
              const response = await api.get(`/api/queue?hospitalId=${hospitalId}`); // Include hospitalId in the query
              const sortedQueue = response.data
                  .map(patient => ({
                      ...patient,
                      statusText: patient.status === "Completed" ? "Completed" : "Start Consultation",
                  }))
                  .sort((a, b) => {
                      if (a.status === b.status) {
                          return new Date(a.queueEntryTime) - new Date(b.queueEntryTime);
                      }
                      return a.status === "Chatting" ? -1 : 1;
                  });

              setQueue(sortedQueue);
          } catch (error) {
              console.error("Failed to fetch queue:", error);
          }
      };

      fetchQueue(); // Call the function when the component mounts
    // Setup WebSocket listener for queue updates
    socket.on("queueUpdate", () => {
      // console.log("Queue update received");
      fetchQueue(); // Refetch the queue data when an update is received
    });

    // Cleanup function to remove the socket listener
    return () => {
      socket.off("queueUpdate");
      socket.disconnect(); // Disconnect the socket on component unmount
    };
  }, [hospitalId]); // Include hospitalId as a dependency to refetch data when it changes

  const handleStartConsultation = (patient) => {
    // console.log("Starting consultation for:", patient); // Log the patient details

    // Dispatch the selectPatient action with the patient as payload
    dispatch(selectPatient(patient));
    navigate("/consultation-dashboard");
    // Additional logic for starting the consultation can be added here
  };

  return (
    <Container
      style={{
        position: "relative",
        marginTop: "50px",
        marginBottom: "50px",
        // top: "52%",
        // left: "50%",
        // transform: "translate(-50%, -50%)",
      }}
    >
      <Typography
        className="doctorDashboardtitle"
        variant="h4"
        component="h6"
        style={{ fontSize: "1rem", fontWeight: "bolder" }}
      >
        Doctor Dashboard
      </Typography>
      <TableContainer
        component={Paper}
        className={show == "top" ? "none" : "tableWrapper"}
        style={{ borderRadius: "0.75rem" }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  opacity: "0.7",
                  color: "rgb(123, 128, 154)",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  transition:
                    "padding-top 1s ease, background-color 0.5s ease,padding 1s ease",
                  paddingTop: show === "top" ? "70px" : "10px",
                  backgroundColor: show === "top" ? "transparent" : "lightgray",
                }}
                className={
                  show == "top" ? "removeStickyTableHead" : "stickyTableHead"
                }
              >
                Sr No.
              </TableCell>
              <TableCell
                style={{
                  opacity: "0.7",
                  color: "rgb(123, 128, 154)",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  transition:
                    "padding-top 1s ease, background-color 0.5s ease,padding 1s ease",
                  paddingTop: show === "top" ? "70px" : "10px",
                  backgroundColor: show === "top" ? "transparent" : "lightgray",
                }}
                className={
                  show == "top" ? "removeStickyTableHead" : "stickyTableHead"
                }
              >
                Patient Name
              </TableCell>
              <TableCell
                style={{
                  opacity: "0.7",
                  color: "rgb(123, 128, 154)",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  transition:
                    "padding-top 1s ease, background-color 0.5s ease,padding 1s ease",
                  paddingTop: show === "top" ? "70px" : "10px",
                  backgroundColor: show === "top" ? "transparent" : "lightgray",
                }}
                className={
                  show == "top" ? "removeStickyTableHead" : "stickyTableHead"
                }
                align="center"
              >
                Status
              </TableCell>
              <TableCell
                style={{
                  opacity: "0.7",
                  color: "rgb(123, 128, 154)",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  transition:
                    "padding-top 1s ease, background-color 0.5s ease,padding 1s ease",
                  paddingTop: show === "top" ? "70px" : "10px",
                  backgroundColor: show === "top" ? "transparent" : "lightgray",
                }}
                className={
                  show == "top" ? "removeStickyTableHead" : "stickyTableHead"
                }
                align="center"
              >
                Action
              </TableCell>
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
                <TableCell
                  component="th"
                  scope="row"
                  style={{ color: "rgb(123, 128, 154)", padding: "16px 25px" }}
                >
                  {index + 1}
                </TableCell>
                <TableCell style={{ color: "rgb(123, 128, 154)" }}>
                  {entry.patientName}
                </TableCell>
                <TableCell
                  style={{
                    color: "rgb(123, 128, 154)",
                    textTransform: "lowercase",
                  }}
                  align="center"
                >
                  {entry.status}
                </TableCell>
                <TableCell align="center">
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={anchorEls[entry._id] ? "long-menu" : undefined}
                        aria-expanded={anchorEls[entry._id] ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, entry._id)}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            "aria-labelledby": "long-button",
                        }}
                        anchorEl={anchorEls[entry._id]}
                        open={Boolean(anchorEls[entry._id])}
                        onClose={() => handleClose(entry._id)}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: "20ch",
                            },
                        }}
                    >
                        <MenuItem
                            variant="contained"
                            color="primary"
                            onClick={() => handleStartConsultation(entry)}
                            disabled={entry.status === "Completed"}
                        >
                            {entry.statusText}
                        </MenuItem>
                    </Menu>
                  {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStartConsultation(entry)}
                    disabled={entry.status === "Completed"}
                    style={{
                      background:
                        "linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))",
                    }}
                  >
                    {entry.statusText}
                  </Button> */}
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
