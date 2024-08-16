import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, List, ListItem, ListItemText, Button } from "@mui/material";
import {useSelector} from "react-redux";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const DeletePatientDialog = ({ isOpen, onClose }) => {
    const [patients, setPatients] = useState([]);
    const hospitalId = useSelector((state) => state.hospital.hospitalId); // Get hospitalId from Redux store

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch(`${API_URL}/api/queue?hospitalId=${hospitalId}`); // Include hospitalId in the query
                const data = await response.json();
                setPatients(data); // Assuming the API returns an array of patient objects
            } catch (error) {
                // console.error("Error fetching patients:", error);
                setPatients([]);
            }
        };

        if (isOpen) {
            fetchPatients();
        }
    }, [isOpen, hospitalId]); // Fetch patients only when the dialog is opened and hospitalId changes

    const handleDeletePatient = async (patientId) => {
        try {
            await fetch(`${API_URL}/api/queue/remove?patientId=${patientId}&hospitalId=${hospitalId}`, { method: 'DELETE' }); // Include hospitalId in the delete request
            // console.log('Patient deleted successfully');
            onClose(); // Close the dialog and rely on websocket for UI update
        } catch (error) {
            // console.error('Failed to delete patient', error);
            // MVP: Detailed error handling can be added later
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Delete Patient</DialogTitle>
            <List>
                {patients.map((patient) => (
                    <ListItem
                        key={patient.patientId}
                        secondaryAction={
                            <Button color="error" onClick={() => handleDeletePatient(patient.patientId)}>
                                Delete
                            </Button>
                        }>
                        <ListItemText primary={patient.patientName} secondary={patient.patientMobileNumber} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
};
