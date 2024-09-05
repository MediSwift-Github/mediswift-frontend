import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import "./prescription-table.css"

const PrescriptionTable = ({ prescriptions, handlePrescriptionChange, addPrescriptionRow }) => {
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
                                onChange={(e) => handlePrescriptionChange(index, "drug", e.target.value)}
                                error={!prescription.drug}
                                helperText={!prescription.drug && "Required"}
                            />
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
