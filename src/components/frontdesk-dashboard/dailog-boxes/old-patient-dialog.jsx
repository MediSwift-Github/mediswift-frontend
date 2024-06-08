import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios"; // Ensure you have axios installed
import api from "../../../api";
export const OldPatientDialog = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]); // Updated to hold fetched data
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (searchTerm.trim()) {
        // Only search if searchTerm is not empty
        try {
          const response = await api.get(
            `/api/searchpatient?name=${searchTerm}`
          );
          setPatients(response.data); // Update state with fetched data
        } catch (error) {
          // console.error("Error fetching patients:", error);
          setPatients([]); // Reset the patients on error
        }
      } else {
        setPatients([]); // Optionally reset/clear results when search term is cleared
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPatients();
    }, 500); // Delay fetching to debounce rapid input

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on unmount or next effect run
  }, [searchTerm]); // Dependency array, effect runs when searchTerm changes

  const handleSelectPatient = async () => {
    if (selectedPatient && selectedPatient._id) {
      try {
        const response = await api.post("/api/queue/add", {
          patientId: selectedPatient._id,
        });

        if (response.status === 201) {
          // console.log("Patient added to the queue successfully");
          // Handle further UI updates or notifications here
        } else {
          console.error(
            "Failed to add patient to queue",
            await response.text()
          );
        }
      } catch (error) {
        // console.error("Error adding patient to queue:", error);
        // Handle error (e.g., show a notification to the user)
      }
    } else {
      // console.error("No patient selected or patient ID is missing");
    }
    onClose(); // Close the dialog after attempting to add to queue
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Old Patient</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <List component="nav" aria-label="patient list">
          {patients.map((patient) => {
            return (
                <ListItem
                    button
                    selected={selectedPatient === patient.name}
                    onClick={() => setSelectedPatient(patient)}
                    key={patient._id} // Assuming each patient object has a unique _id property
                >
                  <ListItemText primary={`${patient.name} - ${patient.mobile_number}`} />
                </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSelectPatient}
          variant="contained"
          color="primary"
          disabled={!selectedPatient}
        >
          Select Patient
        </Button>
      </DialogActions>
    </Dialog>
  );
};
