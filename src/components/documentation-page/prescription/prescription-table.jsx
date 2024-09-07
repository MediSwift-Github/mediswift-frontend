import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, MenuItem } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import "./prescription-table.css";

const PrescriptionTable = ({ prescriptions, handlePrescriptionChange, addPrescriptionRow }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null); // Track which row is active for suggestions
    const [medicineTypes, setMedicineTypes] = useState({}); // Store the medicine types for each row
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

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
        // Update only the "drug" field in the specific row when typing
        handlePrescriptionChange(index, { drug: value });

        // Fetch suggestions based on the input
        if (value) {
            fetchSuggestions(value, index);
        } else {
            setSuggestions([]); // Clear suggestions if input is empty
        }
    };


    const handleKeyDown = (event, index) => {
        if (suggestions.length === 0) return;

        if (event.key === "ArrowDown") {
            setSelectedSuggestionIndex((prev) => (prev + 1) % suggestions.length);
        } else if (event.key === "ArrowUp") {
            setSelectedSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (event.key === "Enter" && selectedSuggestionIndex >= 0) {
            handleSuggestionClick(index, suggestions[selectedSuggestionIndex]);
        }
    };

    const handleSuggestionClick = (index, suggestion) => {
        // Update both "drug" and "notes" at once
        handlePrescriptionChange(index, {
            drug: suggestion.product_name,
            notes: suggestion.Instructions
        });

        // Set the medicine type for this row
        setMedicineTypes((prev) => ({
            ...prev,
            [index]: suggestion.medicine_type,
        }));

        // Clear the suggestions and reset the active index
        setSuggestions([]);
        setActiveIndex(null);
    };



    const getUnitForMedicineType = (medicineType) => {
        switch (medicineType) {
            case "Tablet/Capsule":
                return "tablets";
            case "Spray/Inhalation":
                return "sprays";
            case "Injection":
                return "injections";
            case "Syrup":
                return "ml";
            case "vaccine":
                return "doses";
            case "gargle":
                return "gargles";
            case "lotion":
                return "applications";
            case "drop":
                return "drops";
            case "Gel/Ointment":
                return "applications";
            case "Powder":
                return "grams";
            default:
                return ""; // Default to empty if no match
        }
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
                                value={prescriptions[index].drug} // Properly bind to state
                                onChange={(e) => handleInputChange(index, e.target.value)} // Handle input changes
                                error={!prescriptions[index].drug}
                                helperText={!prescriptions[index].drug && "Required"}
                            />

                            {suggestions.length > 0 && activeIndex === index && (
                                <div
                                    style={{
                                        position: "absolute",
                                        zIndex: 1,
                                        backgroundColor: "white",
                                        border: "1px solid #ccc",
                                        width: '100%',
                                    }}
                                >
                                    {suggestions.map((suggestion, suggestionIndex) => (
                                        <MenuItem
                                            key={suggestion._id}
                                            onClick={() => handleSuggestionClick(index, suggestion)}
                                            selected={suggestionIndex === selectedSuggestionIndex}  // Highlight selected suggestion
                                        >
                                            {suggestion.product_name}
                                        </MenuItem>
                                    ))}
                                </div>
                            )}
                        </TableCell>
                        <TableCell>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    value={prescriptions[index].dosagePerDay} // Properly bind to state
                                    onChange={(e) => handlePrescriptionChange(index, { dosagePerDay: e.target.value })} // Update this field only
                                    error={!prescriptions[index].dosagePerDay}
                                    helperText={!prescriptions[index].dosagePerDay && "Required"}
                                />

                                <span style={{ marginLeft: 10 }}>
                                       {getUnitForMedicineType(medicineTypes[index])}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <TextField
                                value={prescriptions[index].frequency}
                                onChange={(e) => handlePrescriptionChange(index, { frequency: e.target.value })}
                                error={!prescriptions[index].frequency}
                                helperText={!prescriptions[index].frequency && "Required"}
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                value={prescriptions[index].days}
                                onChange={(e) => handlePrescriptionChange(index, { days: e.target.value })}
                                error={!prescriptions[index].days}
                                helperText={!prescriptions[index].days && "Required"}
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                value={prescriptions[index].notes}
                                onChange={(e) => handlePrescriptionChange(index, { notes: e.target.value })}
                                multiline
                                rows={1}
                                InputProps={{ style: { padding: "10px 14px" } }}
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
