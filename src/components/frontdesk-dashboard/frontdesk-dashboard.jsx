import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { AppBarComponent } from "./AppBarComponent/app-bar"; // Adjust the import path as necessary
import { DrawerComponent } from "./drawer-component/drawer"; // Adjust the import path as necessary
import { PatientTable } from "./patient-queue-table/patient-table"; // Adjust the import path as necessary
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LocalHospitalSharpIcon from "@mui/icons-material/LocalHospitalSharp";

import "./frontdesk-dashboard.css";

const FrontDeskDashboard = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [newPatientVisibility, setNewPatientVisibility] = useState(false);
  const [oldPatientVisibility, setOldPatientVisibility] = useState(false);
  const [deletePatientVisibility, setDeletePatientVisibility] = useState(false);

  const pages = ["Products", "Pricing", "Blog"];
  const settings = ["Profile", "Account", "Dashboard", "Logout"];
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleClearQueue = async () => {
    try {
      await fetch(`${API_URL}/api/queue/remove?clearAll=true`, {
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

  const controlNavbar = () => {
    if (window.scrollY > 15) {
      if (window.scrollY > lastScrollY) {
        setShow("hide");
      } else {
        setShow("show");
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

  useEffect(() => {
    // Function to update the state with the current window width
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBarComponent
        navBarStyle={show}
        loc={location.pathname.replace("/", "")}
      />
      <DrawerComponent
        newPatient={newPatientVisibility}
        oldPatient={oldPatientVisibility}
        deletePatient={deletePatientVisibility}
        setNewPatientVisibility={setNewPatientVisibility}
        setOldPatientVisibility={setOldPatientVisibility}
        setDeletePatientVisibility={setDeletePatientVisibility}
      />
      {windowWidth < 1050 && (
        <Container maxWidth="xl" className="containerWrapper">
          <Toolbar disableGutters>
            {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              // href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Grid className="mainLogo">
                <LocalHospitalSharpIcon
                  style={{ marginRight: "2px", height: "30px" }}
                />
                <Typography variant="h6">MediSwift</Typography>
              </Grid>
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {/* {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))} */}
                <MenuItem key={1}>
                  <Typography
                    textAlign="center"
                    onClick={() => setNewPatientVisibility(true)}
                  >
                    New patient
                  </Typography>
                </MenuItem>
                <MenuItem key={2}>
                  <Typography
                    textAlign="center"
                    onClick={() => setOldPatientVisibility(true)}
                  >
                    Old patient
                  </Typography>
                </MenuItem>
                <MenuItem key={3}>
                  <Typography
                    textAlign="center"
                    onClick={() => setDeletePatientVisibility(true)}
                  >
                    Delete patient
                  </Typography>
                </MenuItem>
                <MenuItem key={4}>
                  <Typography textAlign="center" onClick={handleClearQueue}>
                    Clear queue
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            {/* <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} /> */}
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/frontdesk-dashboard"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Grid className="mainLogo">
                <LocalHospitalSharpIcon
                  style={{ marginRight: "2px", height: "30px" }}
                />
                <Typography variant="h6">MediSwift</Typography>
              </Grid>
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                key={5}
                // onClick={handleCloseNavMenu}
                onClick={() => setNewPatientVisibility(true)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                New Patient
              </Button>
              <Button
                key={6}
                onClick={() => setOldPatientVisibility(true)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Old Patient
              </Button>
              <Button
                key={7}
                onClick={() => setDeletePatientVisibility(true)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Delete Patient
              </Button>
              <Button
                key={8}
                onClick={handleClearQueue}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Clear Queue
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))} */}

                <MenuItem key={"newPatient"}>
                  <Typography textAlign="center">New Patient</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      )}
      <Box
        component="main"
        fullWidth
        style={{
          width: windowWidth < 1050 ? "calc(100% - 22%)" : "auto",
          marginLeft:
            windowWidth < 1050 ? "calc(100% - 99%)" : "calc(100% - 79%)",
        }}
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          borderRadius: "10px",
          marginTop: "100px", // Adjust the margin top to match the height of the AppBar
          marginBottom: "17px",
          padding: "15px",
          overflow: "auto",
        }}
        className="patientListWrapper"
      >
        {/* <Toolbar /> */}
        <Typography
          variant="h6"
          gutterBottom
          style={{ padding: "15px 0px 0px 15px" }}
        >
          Patient List
        </Typography>
        <PatientTable />
        {/* The PatientDialog components are removed from here since they are now in DrawerComponent */}
      </Box>
    </Box>
  );
};

export default FrontDeskDashboard;
