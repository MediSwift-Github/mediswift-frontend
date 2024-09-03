import { AppBar, Toolbar, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import "./app-bar.css";
import { useEffect, useState } from "react";

export const AppBarComponent = ({ navBarStyle, loc }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to update the state with the current window width
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppBar
      position="fixed"
      className="appBarHeader"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      style={{
        marginTop: `${windowWidth < 1050 ? "80px" : "17px"}`,
        backgroundColor: `${
          navBarStyle == "top" ? "transparent" : "rgba(255, 255, 255, 0.8)"
        }`,
        backdropFilter: `${
          navBarStyle == "hide" && "saturate(200%) blur(1.875rem)"
        }`,
        border: `${navBarStyle == "top" ? "none" : "1px solid white"}`,
        // paddingLeft: "5px",
        boxShadow: `${
          navBarStyle == "top"
            ? "none"
            : "rgba(255, 255, 255, 0.9) 0rem 0rem 0.0625rem 0.0625rem inset, rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem"
        }`,
        borderRadius: "0.75rem",
        marginRight: windowWidth < 1050 && "unset",
      }}
    >
      <Toolbar
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "baseline",
          padding: "10px",
        }}
      >
        <Breadcrumbs aria-label="breadcrumb" style={{ marginLeft: "5px" }}>
          <Link underline="hover" color="inherit" href="/">
            <HomeIcon
              style={{ color: "rgb(108, 117, 125)", fontSize: "large" }}
            />
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/material-ui/getting-started/installation/"
            style={{ textTransform: "capitalize" }}
          >
            {loc.replace("-", " ")}
          </Link>
        </Breadcrumbs>
        <Typography
          variant="body"
          component="div"
          fontSize="large"
          sx={{ flexGrow: 1 }}
          style={{ color: "rgb(52, 71, 103)", marginTop: "5px" }}
        >
          Front Desk Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
