import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, MenuItem } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import "./prescription-table.css";

const PrescriptionTable = ({ prescriptions, handlePrescriptionChange, addPrescriptionRow }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null); // Track which row is active for suggestions

    const fetchSuggestions = async (query, index) => {
        if (!query) return;
        setLoading(true);
        setActiveIndex(index); // Track the active row for suggestions

        try {
            const response = await fetch(`/api/autocomplete?query=${query}`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (index, value) => {
        handlePrescriptionChange(index, "drug", value);
        fetchSuggestions(value, index);
    };

    const handleSuggestionClick = (index, suggestion) => {
        handlePrescriptionChange(index, "drug", suggestion.product_name);
        setSuggestions([]); // Clear suggestions after selection
        setActiveIndex(null); // Clear active index
    };

    return (
        <Table sx={{ mb: 3 }}>
            <TableHead>
                <TableRow>
                    <TableCell>Sr No</TableCell>
                    <TableCell>Medication</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Times per Day</TableCell>
                    <TableCell>No. of Days</TableCell>
                    <TableCell>Instructions</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {prescriptions.map((prescription, index) => (
                    <TableRow key={index}>
                        <TableCell>{prescription.srNo}</TableCell>
                        <TableCell>
                            <TextField
                                value={prescription.drug}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                error={!prescription.drug}
                                helperText={!prescription.drug && "Required"}
                            />
                            {suggestions.length > 0 && activeIndex === index && (
                                <div style={{ position: "absolute", zIndex: 1, backgroundColor: "white", border: "1px solid #ccc", width: '100%' }}>
                                    {suggestions.map((suggestion) => (
                                        <MenuItem
                                            key={suggestion._id}  // Use a unique key like _id
                                            onClick={() => handleSuggestionClick(index, suggestion)}
                                        >
                                            {suggestion.product_name}
                                        </MenuItem>
                                    ))}
                                </div>
                            )}
                        </TableCell>
                        <TableCell>
                            <TextField
                                value={prescription.dosagePerDay}
                                onChange={(e) => handlePrescriptionChange(index, "dosagePerDay", e.target.value)}
                                error={!prescription.dosagePerDay}
                                helperText={!prescription.dosagePerDay && "Required"}
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                value={prescription.frequency}
                                onChange={(e) => handlePrescriptionChange(index, "frequency", e.target.value)}
                                error={!prescription.frequency}
                                helperText={!prescription.frequency && "Required"}
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                value={prescription.days}
                                onChange={(e) => handlePrescriptionChange(index, "days", e.target.value)}
                                error={!prescription.days}
                                helperText={!prescription.days && "Required"}
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                value={prescription.notes}
                                onChange={(e) => handlePrescriptionChange(index, "notes", e.target.value)}
                                multiline
                                rows={1}
                                InputProps={{
                                    style: {
                                        padding: "10px 14px",
                                    },
                                }}
                            />
                        </TableCell>
                        <TableCell>
                            <IconButton onClick={addPrescriptionRow}>
                                <AddCircle />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default PrescriptionTable;
