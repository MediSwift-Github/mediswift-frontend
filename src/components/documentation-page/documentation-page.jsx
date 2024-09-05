import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Paper, Tabs, Tab, Button, Box } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import "./documentation-page.css";
import PrescriptionTable from "./prescription/prescription-table";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const DocumentationPage = () => {
  const [value, setValue] = useState(0); // Tab selection state
  const [healthRecordContent, setHealthRecordContent] = useState({ ops: [] }); // Editor content for Health Record
  const [patientHandoutContent, setPatientHandoutContent] = useState(""); // Editor content for Patient Handout
  const [prescriptions, setPrescriptions] = useState([
    { srNo: 1, drug: "", dosagePerDay: "", days: "", frequency: "", notes: "" },
  ]);
  const selectedPatient = useSelector((state) => state.patient.selectedPatient);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addPrescriptionRow = () => {
    // Only add a new row if the last row has some data filled in
    const lastPrescription = prescriptions[prescriptions.length - 1];
    if (lastPrescription.drug || lastPrescription.dosagePerDay || lastPrescription.days || lastPrescription.frequency || lastPrescription.notes) {
      setPrescriptions([
        ...prescriptions,
        { srNo: prescriptions.length + 1, drug: "", dosagePerDay: "", days: "", frequency: "", notes: "" },
      ]);
    }
  };


  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = prescriptions.map((prescription, i) =>
        i === index ? { ...prescription, [field]: value } : prescription
    );
    setPrescriptions(updatedPrescriptions);
  };

  const formatToJsonDelta = (data) => {
    const ops = []; // Initialize Delta operations array

    const addText = (text, attributes = {}) => {
      ops.push({ insert: text, attributes });
    };

    const addObject = (obj, level = 0) => {
      if (typeof obj === "object" && !Array.isArray(obj)) {
        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          if (value === null) return; // Skip null values

          if (typeof value === "object" && !Array.isArray(value)) {
            addText(`${" ".repeat(level * 2)}${key}\n`, { bold: true }); // Add key with indentation
            addObject(value, level + 1); // Recurse into object
          } else if (Array.isArray(value)) {
            addText(`${" ".repeat(level * 2)}${key}:\n`, { bold: true });
            value.forEach((item) => {
              if (typeof item === "object") {
                addObject(item, level + 1); // Handle objects within arrays
              } else {
                addText(`${" ".repeat((level + 1) * 2)}- ${item}\n`); // Handle strings within arrays
              }
            });
          } else {
            addText(`${" ".repeat(level * 2)}${key}: ${value}\n`); // Handle simple key-value pairs
          }
        });
      } else if (Array.isArray(obj)) {
        obj.forEach((item) => {
          if (typeof item === "object") {
            addObject(item, level); // Recurse without adding key
          } else {
            addText(`- ${item}\n`); // Handle plain string items in array
          }
        });
      }
    };

    addObject(data); // Initialize the recursive parsing
    return { ops }; // Return the ops array formatted for Quill Delta
  };

  useEffect(() => {
    const getSummary = async () => {
      if (selectedPatient) {
        setIsLoading(true); // Start loading
        const _id = selectedPatient.patientId;
        const date = new Date().toISOString().split("T")[0];

        try {
          const response = await fetch(
            `${API_URL}/getSummary?_id=${_id}&date=${date}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setHealthRecordContent(formatToJsonDelta(data.ehrContent));
            setPatientHandoutContent(formatToJsonDelta(data.handoutContent));
          } else {
            // console.error("Failed to fetch summary:", response.statusText);
          }
        } catch (error) {
          // console.error("Error fetching patient summary:", error);
        } finally {
          setIsLoading(false); // End loading
        }
      }
    };

    getSummary();
  }, [selectedPatient]);



  const saveHealthRecord = async () => {
    // Log the patient and health record content before sending
    console.log("Selected Patient:", selectedPatient);
    console.log("Health Record Content:", healthRecordContent); // Log current state
    console.log("Prescriptions:", prescriptions);

    // Ensure there is a selected patient
    if (!selectedPatient) {
      alert("No patient selected!");
      return;
    }

    // Filter out empty prescriptions
    const filteredPrescriptions = prescriptions.filter(
        (prescription) =>
            prescription.drug ||
            prescription.dosagePerDay ||
            prescription.days ||
            prescription.frequency ||
            prescription.notes
    );
    const summaryDate = new Date().toISOString().split("T")[0];

    // Prepare the payload with the patient ID and health record content
    const healthRecordPayload = {
      patientId: selectedPatient.patientId,
      healthRecord: healthRecordContent,
      summaryDate: summaryDate,
    };

    const prescriptionPayload = {
      patientId: selectedPatient.patientId,
      prescriptions: filteredPrescriptions,
      summaryDate: summaryDate,
    };

    // Log the payloads before sending the requests
    console.log("Health Record Payload:", healthRecordPayload);
    console.log("Prescription Payload:", prescriptionPayload);

    try {
      // Log before sending the request
      console.log("Sending Health Record...");

      // First, save the health record
      const healthRecordResponse = await fetch("/api/saveHealthRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(healthRecordPayload), // Send payload as JSON string
      });

      // Log the response status
      console.log("Health Record Response Status:", healthRecordResponse.status);

      if (!healthRecordResponse.ok) {
        console.error(
            "Failed to save Health Record:",
            healthRecordResponse.statusText
        );
        return;
      }

      // Log success message after saving health record
      const healthRecordResult = await healthRecordResponse.json();
      console.log("Health Record saved successfully:", healthRecordResult);

      // Then, save the prescriptions
      console.log("Sending Prescriptions...");
      const prescriptionResponse = await fetch(
          `${API_URL}/api/savePrescriptions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(prescriptionPayload),
          }
      );

      // Log the response status for prescriptions
      console.log("Prescription Response Status:", prescriptionResponse.status);

      if (!prescriptionResponse.ok) {
        console.error(
            "Failed to save Prescriptions:",
            prescriptionResponse.statusText
        );
        return;
      }

      const prescriptionResult = await prescriptionResponse.json();
      console.log("Prescriptions saved successfully:", prescriptionResult);
    } catch (error) {
      // Log the error if any occurs
      console.error("Error saving Health Record or Prescriptions:", error);
    }

    // Optionally switch to the Patient Handout tab
    setValue(1);
  };

  const sendPatientHandout = async () => {
    if (!selectedPatient) {
      alert("No patient selected!");
      return;
    }

    const summaryDate = new Date().toISOString().split("T")[0];

    const payload = {
      patientId: selectedPatient.patientId,
      patientHandout: patientHandoutContent,
      summaryDate: summaryDate,
    };

    try {
      const response = await fetch(`${API_URL}/api/savePatientHandout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        // console.log("Patient Handout sent successfully:", result);

        // Navigate to Doctor Dashboard after successful update
        navigate("/doctor-dashboard");
      } else {
        // console.error("Failed to send Patient Handout:", response.statusText);
      }
    } catch (error) {
      // console.error("Error sending Patient Handout:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: "50px 50px 0px 50px",
        maxWidth: 1235,
        margin: "0 auto",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          position: "relative",
          borderRadius: "0.75rem !important",
        }}
      >
        <Typography
          className="documentationDashboardtitle"
          variant="h4"
          component="h6"
          style={{
            fontSize: "1rem",
            fontWeight: "bolder",
          }}
        >
          Notes for{" "}
          {selectedPatient ? selectedPatient.patientName : "Select a Patient"}
        </Typography>
        <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            style={{ paddingTop: "60px" }}
        >
          <Tab label="Health Record" />
          <Tab label="Patient Handout" disabled/>
        </Tabs>
      </Paper>

      {value === 0 && (
          <>
            {/* Prescription Table */}
            <PrescriptionTable
                prescriptions={prescriptions}
                handlePrescriptionChange={handlePrescriptionChange}
                addPrescriptionRow={addPrescriptionRow}
            />

            {/* Health Record Editor */}
            <div
                style={{
                  position: "relative",
                  height: "300px",
                  marginBottom: "50px",
                }}
            >
              <ReactQuill
                  theme="snow"
                  value={healthRecordContent}
                  onChange={setHealthRecordContent}
                  style={{ height: "100%" }}
              />
              {isLoading && (
                  <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.5)", // Adding a slight white overlay
                      }}
                  >
                    <CircularProgress />
                  </div>
              )}
            </div>
          </>
      )}

      {value === 1 && (
        <ReactQuill
          theme="snow"
          value={patientHandoutContent}
          onChange={setPatientHandoutContent}
          style={{ height: "300px", marginBottom: "50px" }}
        />
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {value === 0 && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={saveHealthRecord}
          >
            Save Health Record
          </Button>
        )}
        {value === 1 && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={sendPatientHandout}
          >
            Send Handout
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DocumentationPage;
