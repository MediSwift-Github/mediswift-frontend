import React, { useState } from "react";
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

export const DrawerComponent = () => {
  const [isNewPatientDialogOpen, setNewPatientDialogOpen] = useState(false);
  const [isOldPatientDialogOpen, setOldPatientDialogOpen] = useState(false);
  const hospitalId = useSelector((state) => state.hospital.hospitalId); // Get hospitalId from Redux store

  const [isDeletePatientDialogOpen, setDeletePatientDialogOpen] =
    useState(false);

  const handleNewPatientClick = () => setNewPatientDialogOpen(true);
  const handleOldPatientClick = () => setOldPatientDialogOpen(true);
  const handleDeletePatientClick = () => setDeletePatientDialogOpen(true);
  const handleClearQueue = async () => {
    try {
      await fetch(`${API_URL}/api/queue/remove?clearAll=true&hospitalId=${hospitalId}`, {
        method: "DELETE",
      });
      // console.log("Queue cleared successfully");
      // Force a page reload to ensure the UI is in sync with the back end
      window.location.reload();
    } catch (error) {
      // console.error("Failed to clear the queue", error);
      // MVP: Error handling can be expanded in future iterations
    }
  };

  return (
    <DrawerPaper variant="permanent" anchor="left" className="mainDrawer">
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
              className="currentNav"
              fullWidth
              variant="contained"
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
            <Button fullWidth onClick={handleOldPatientClick}>
              <ListItemIcon style={{ minWidth: "35px" }}>
                <SearchIcon style={{ color: "white" }} />
              </ListItemIcon>
              <Typography variant="overline" display="block" gutterBottom>
                Old Patient
              </Typography>
            </Button>
          </ListItem>
          <ListItem disablePadding>
            <Button fullWidth onClick={handleDeletePatientClick}>
              <ListItemIcon style={{ minWidth: "35px" }}>
                <DeleteOutlineIcon style={{ color: "white" }} />
              </ListItemIcon>
              <Typography variant="overline" display="block" gutterBottom>
                Delete Patient
              </Typography>
            </Button>
          </ListItem>
          <ListItem disablePadding>
            <Button fullWidth onClick={handleClearQueue}>
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
          <Button fullWidth variant="contained">
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
          onClose={() => setNewPatientDialogOpen(false)}
        />
        <OldPatientDialog
          isOpen={isOldPatientDialogOpen}
          onClose={() => setOldPatientDialogOpen(false)}
        />
        <DeletePatientDialog
          isOpen={isDeletePatientDialogOpen}
          onClose={() => setDeletePatientDialogOpen(false)}
        />
      </Box>
    </DrawerPaper>
  );
};
