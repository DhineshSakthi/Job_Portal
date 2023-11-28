import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import MenuIcon from "@mui/icons-material/Menu";
import Cookies from "js-cookie";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { isMobile } from "react-device-detect";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CsvUploadComponent from "../Admin/CsvUpload";

function LayoutAdmin() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [jobsMenuOpen, setJobsMenuOpen] = useState(false);
  const [jobsAnchorEl, setJobsAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);
  const [ourJobsAnchorEl, setOurJobsAnchorEl] = React.useState(null);
  const [ourJobsMenuOpen, setOurJobsMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    if (event.target.textContent === "Upload Job") {
      handleOpenDialog();
    } else {
      setAnchorEl(event.currentTarget);
      setJobsAnchorEl(event.currentTarget);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setJobsAnchorEl(null);
  };

  const handleJobsClick = () => {
    setJobsMenuOpen(!jobsMenuOpen);
  };

  const handleOurJobsClick = () => {
    setOurJobsMenuOpen(!ourJobsMenuOpen);
  };

  const handleOpenDialog = () => {
    setOpen(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const logoutAction = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("object_id");
    Cookies.remove("token");
    navigate("/");
  };

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("object_id");
        Cookies.remove("token");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const tokenCheckInterval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, []);

  return (
    <div>
      {isMobile ? (
        <AppBar position="static" style={{ height: "70px" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
              style={{
                marginTop: "-27px",
              }}
            >
              <MenuIcon fontSize="medium" />
            </IconButton>
            <Typography
              style={{
                flexGrow: 1,
                fontSize: "20px",
                fontFamily: "Georgia, 'Times New Roman', Times, serif",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
                marginTop: "-27px",
              }}
            >
              JOB PORTAL
            </Typography>
          </Toolbar>
        </AppBar>
      ) : (
        <AppBar position="static" style={{ height: "70px" }}>
          <Toolbar>
            <Typography
              style={{
                flexGrow: 1,
                fontSize: "26px",
                fontFamily: "Georgia, 'Times New Roman', Times, serif",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "450px",
                marginTop: "-33px",
              }}
            >
              JOB PORTAL
            </Typography>
            <Button
              color="inherit"
              component={Link}
              to="/adminprofile"
              style={{
                marginRight: "28px",
                fontSize: "15px",
                marginTop: "-28px",
                fontFamily: "Times New Roman",
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              aria-controls="jobs-menu"
              aria-haspopup="true"
              onClick={(e) => setJobsAnchorEl(e.currentTarget)}
              style={{
                marginRight: "28px",
                fontSize: "14px",
                marginTop: "-28px",
                fontFamily: "Times New Roman",
              }}
            >
              Jobs
            </Button>
            <Menu
              id="jobs-menu"
              anchorEl={jobsAnchorEl}
              open={Boolean(jobsAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={handleMenuClose}
                component={Link}
                to="/jobadmin"
                style={{
                  fontSize: "15px",
                  fontFamily: "Times New Roman",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "-10px",
                }}
              >
                Create Job
              </MenuItem>
              <MenuItem
                onClick={handleProfileMenuOpen}
                style={{
                  fontSize: "15px",
                  fontFamily: "Times New Roman",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "-10px",
                  marginBottom: "-5px",
                }}
              >
                Upload Job
              </MenuItem>
            </Menu>
            <Button
              color="inherit"
              component={Link}
              to="/ourjobs"
              style={{
                marginRight: "28px",
                fontSize: "14px",
                marginTop: "-28px",
                fontFamily: "Times New Roman",
                display: "flex",
                alignItems: "center",
              }}
              aria-controls="our-jobs-menu"
              aria-haspopup="true"
              onClick={(e) => setOurJobsAnchorEl(e.currentTarget)}
            >
              Our Jobs
              <KeyboardArrowDownIcon />
            </Button>
            <Menu
              id="our-jobs-menu"
              anchorEl={ourJobsAnchorEl}
              open={Boolean(ourJobsAnchorEl)}
              onClose={() => setOurJobsAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  setOurJobsAnchorEl(null);
                  navigate("/viewapplicants");
                }}
                style={{
                  fontSize: "14px",
                  fontFamily: "Times New Roman",
                  display: "flex",
                  alignItems: "center",
                  height: "10px",
                }}
              >
                View Applicants
              </MenuItem>
            </Menu>
            <Button
              color="inherit"
              component={Link}
              to="/aboutjobproviders"
              style={{
                marginRight: "28px",
                fontSize: "14px",
                marginTop: "-28px",
                fontFamily: "Times New Roman",
              }}
            >
              About Us
            </Button>
            <Button
              color="inherit"
              onClick={logoutAction}
              style={{
                marginRight: "-5px",
                fontSize: "14px",
                marginTop: "-28px",
                fontFamily: "Times New Roman",
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <List>
          <ListItem component={Link} to="/adminprofile">
            <ListItemText>Home</ListItemText>
          </ListItem>
          <ListItem button onClick={handleJobsClick}>
            <ListItemText>Jobs</ListItemText>
            {jobsMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={jobsMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                component={Link}
                to="/jobadmin"
                style={{ paddingLeft: "32px" }}
              >
                <ListItemText>Create Job</ListItemText>
              </ListItem>
              <ListItem
                onClick={handleProfileMenuOpen}
                style={{ paddingLeft: "32px" }}
              >
                <ListItemText>Upload Job</ListItemText>
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={handleOurJobsClick}>
            <ListItemText>Our Jobs</ListItemText>
            {ourJobsMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={ourJobsMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                component={Link}
                to="/ourjobs"
                style={{ paddingLeft: "32px" }}
              >
                <ListItemText>Posted Jobs</ListItemText>
              </ListItem>
              <ListItem
                component={Link}
                to="/viewapplicants"
                style={{ paddingLeft: "32px" }}
              >
                <ListItemText>View Applicants</ListItemText>
              </ListItem>
            </List>
          </Collapse>
          <ListItem component={Link} to="/aboutjobproviders">
            <ListItemText>About Us</ListItemText>
          </ListItem>
          <ListItem onClick={logoutAction}>
            <ListItemText>Logout</ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <Dialog open={open} onClose={handleCloseDialog}>
        <CsvUploadComponent
          open={open}
          onClose={handleCloseDialog}
          //onSuccess={handleUploadSuccess}
        />
      </Dialog>
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutAdmin;
