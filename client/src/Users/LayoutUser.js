import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

function LayoutUser() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Open the dropdown menu for "My Profile"
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const logoutAction = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("object_id");
    navigate("/");
  };

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
            <IconButton
              edge="end"
              color="inherit"
              aria-label="account"
              onClick={handleProfileMenuOpen}
              style={{
                marginTop: "-27px",
              }}
            >
              <AccountCircleIcon fontSize="large" />
            </IconButton>
          </Toolbar>
        </AppBar>
      ) : (
        <AppBar position="static" style={{ height: "70px" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleProfileMenuOpen}
              style={{
                marginTop: "-33px",
              }}
            >
              <AccountCircleIcon fontSize="large" />
            </IconButton>
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
              to="/profile"
              style={{
                marginRight: "25px",
                fontSize: "15px",
                marginTop: "-28px",
                fontFamily: "Times New Roman",
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/joblistings"
              style={{
                marginRight: "25px",
                marginTop: "-28px",
                fontSize: "15px",
                fontFamily: "Times New Roman",
              }}
            >
              Jobs
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/appliedjobs"
              style={{
                marginRight: "25px",
                marginTop: "-28px",
                fontSize: "15px",
                fontFamily: "Times New Roman",
              }}
            >
              Applied Jobs
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/about"
              style={{
                marginRight: "25px",
                marginTop: "-28px",
                fontSize: "15px",
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
                marginTop: "-28px",
                fontSize: "15px",
                fontFamily: "Times New Roman",
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={handleMenuClose}
          component={Link}
          to="/viewprofile"
          style={{
            fontSize: "15px",
            fontFamily: "Times New Roman",
            display: "flex",
            marginTop: "-10px",
          }}
        >
          View Profile
        </MenuItem>
        <MenuItem
          onClick={logoutAction}
          style={{
            fontSize: "15px",
            fontFamily: "Times New Roman",
            display: "flex",
            marginBottom: "-5px",

            marginTop: "-10px",
          }}
        >
          Logout
        </MenuItem>
      </Menu>
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <List>
          <ListItem component={Link} to="/profile">
            <ListItemText>Home</ListItemText>
          </ListItem>
          <ListItem component={Link} to="/joblistings">
            <ListItemText>Jobs</ListItemText>
          </ListItem>
          <ListItem component={Link} to="/appliedjobs">
            <ListItemText>Applied Jobs</ListItemText>
          </ListItem>
          <ListItem component={Link} to="/about">
            <ListItemText>About Us</ListItemText>
          </ListItem>
          <ListItem onClick={logoutAction}>
            <ListItemText>Logout</ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutUser;
