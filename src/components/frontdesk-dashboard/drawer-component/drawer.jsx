import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  styled,
  Toolbar,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { NewPatientDialog } from "../dailog-boxes/new-patient-dailog";
import { OldPatientDialog } from "../dailog-boxes/old-patient-dialog";
import { DeletePatientDialog } from "../dailog-boxes/delete-patient-dialog";
import Grid from "@mui/material/Grid";
import LocalHospitalSharpIcon from "@mui/icons-material/LocalHospitalSharp";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import { useSelector } from "react-redux"; // Import useSelector to get hospitalId from Redux store

import "./drawer.css";
import Typography from "@mui/material/Typography";

const drawerWidth = "20%";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const DrawerPaper = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
  },
}));

export const DrawerComponent = ({
  newPatient,
  oldPatient,
  deletePatient,
  setNewPatientVisibility,
  setOldPatientVisibility,
  setDeletePatientVisibility,
}) => {
  const [isNewPatientDialogOpen, setNewPatientDialogOpen] = useState(false);
  const [isOldPatientDialogOpen, setOldPatientDialogOpen] = useState(false);
  const hospitalId = useSelector((state) => state.hospital.hospitalId); // Get hospitalId from Redux store

  const [isDeletePatientDialogOpen, setDeletePatientDialogOpen] =
    useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeButton, setActiveButton] = useState(null);

  const handleNewPatientClick = () => {
    setNewPatientDialogOpen(true);
    setActiveButton("newPatient");
  };
  const handleOldPatientClick = () => {
    setOldPatientDialogOpen(true);
    setActiveButton("oldPatient");
  };
  const handleDeletePatientClick = () => {
    setDeletePatientDialogOpen(true);
    setActiveButton("deletePatient");
  };

  const handleClearQueue = async () => {
    try {
      setActiveButton("clearQueue");
      await fetch(
        `${API_URL}/api/queue/remove?clearAll=true&hospitalId=${hospitalId}`,
        {
          method: "DELETE",
        }
      );
      // console.log("Queue cleared successfully");
      // Force a page reload to ensure the UI is in sync with the back end
      window.location.reload();
    } catch (error) {
      // console.error("Failed to clear the queue", error);
      // MVP: Error handling can be expanded in future iterations
    }
  };

  const handleClose = () => {
    setActiveButton(null);
    setNewPatientVisibility(false);
    setOldPatientVisibility(false);
    setDeletePatientVisibility(false);
  };

  useEffect(() => {
    if (newPatient) {
      setNewPatientDialogOpen(true);
    }
    if (oldPatient) {
      setOldPatientDialogOpen(true);
    }
    if (deletePatient) {
      setDeletePatientDialogOpen(true);
    }
  }, [newPatient, oldPatient, deletePatient]);

  useEffect(() => {
    // Function to update the state with the current window width
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DrawerPaper
      variant="permanent"
      anchor="left"
      className="mainDrawer"
      style={{ display: windowWidth < 1050 && "none" }}
    >
      {/* <Toolbar /> */}
      <Box gap={4} p={2} className="navbarWrapper">
        <Grid className="mainLogo">
          <LocalHospitalSharpIcon
            style={{ marginRight: "2px", height: "30px" }}
          />
          <Typography variant="h6">MediSwift</Typography>
        </Grid>
        <List>
          <Divider variant="middle" component="li" className="logoNavDivider" />
        </List>
        <List>
          <ListItem disablePadding>
            <Button
              className={activeButton === "newPatient" ? "currentNav" : ""}
              variant={activeButton === "newPatient" && "contained"}
              onClick={handleNewPatientClick}
            >
              <ListItemIcon style={{ minWidth: "35px" }}>
                <AddIcon style={{ color: "white" }} />
              </ListItemIcon>
              <Typography variant="overline" display="block" gutterBottom>
                New Patient
              </Typography>
            </Button>
          </ListItem>
          <ListItem disablePadding>
            <Button
              className={activeButton === "oldPatient" ? "currentNav" : ""}
              variant={activeButton === "oldPatient" && "contained"}
              onClick={handleOldPatientClick}
            >
              <ListItemIcon style={{ minWidth: "35px" }}>
                <SearchIcon style={{ color: "white" }} />
              </ListItemIcon>
              <Typography variant="overline" display="block" gutterBottom>
                Old Patient
              </Typography>
            </Button>
          </ListItem>
          <ListItem disablePadding>
            <Button
              className={activeButton === "deletePatient" ? "currentNav" : ""}
              variant={activeButton === "deletePatient" && "contained"}
              onClick={handleDeletePatientClick}
            >
              <ListItemIcon style={{ minWidth: "35px" }}>
                <DeleteOutlineIcon style={{ color: "white" }} />
              </ListItemIcon>
              <Typography variant="overline" display="block" gutterBottom>
                Delete Patient
              </Typography>
            </Button>
          </ListItem>
          <ListItem disablePadding>
            <Button
              className={activeButton === "clearQueue" ? "currentNav" : ""}
              variant={activeButton === "clearQueue" && "contained"}
              onClick={handleClearQueue}
            >
              <ListItemIcon style={{ minWidth: "35px" }}>
                <GroupRemoveIcon style={{ color: "white" }} />
              </ListItemIcon>
              <Typography variant="overline" display="block" gutterBottom>
                Clear Queue
              </Typography>
            </Button>
          </ListItem>
        </List>
        {/* <Box classNam="buyPremium">
          <Button  variant="contained">
            <ListItemIcon style={{ minWidth: "35px" }}>
              <InboxIcon style={{ color: "white" }} />
            </ListItemIcon>
            <Typography variant="overline" display="block" gutterBottom>
              UPDRAGE TO PRO
            </Typography>
          </Button>
        </Box> */}
        <NewPatientDialog
          isOpen={isNewPatientDialogOpen}
          onClose={() => {
            setNewPatientDialogOpen(false);
            handleClose();
          }}
        />
        <OldPatientDialog
          isOpen={isOldPatientDialogOpen}
          onClose={() => {
            setOldPatientDialogOpen(false);
            handleClose();
          }}
        />
        <DeletePatientDialog
          isOpen={isDeletePatientDialogOpen}
          onClose={() => {
            setDeletePatientDialogOpen(false);
            handleClose();
          }}
        />
      </Box>
    </DrawerPaper>
  );
};
