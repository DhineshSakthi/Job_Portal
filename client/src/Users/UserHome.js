import React from "react";
import {
  Typography,
  Button,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Link } from "react-router-dom";
import LayoutUser from "./LayoutUser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../css/Home.css";

function UserHome() {
  const paperStyle = {
    padding: "20px",
    margin: "20px auto",
    marginLeft: "50px",
    marginTop: "30px",
    maxWidth: "700px",
    height: "350px",
    backgroundColor: "rgba(245, 245, 245, 1)",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 1)",
    borderRadius: "8px",
  };

  const paperStyle1 = {
    padding: "5px",
    margin: "20px auto",
    marginRight: "50px",
    marginTop: "-430px",
    maxWidth: "350px",
    backgroundColor: "rgba(245, 245, 245, 0)",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0)",
    borderRadius: "8px",
  };

  const accordionStyle = {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    marginBottom: "2px",
    height: "110px",
  };

  return (
    <div className="home-page">
      <LayoutUser />
      <Box display="flex" justifyContent="center" alignItems="center">
        <Paper style={paperStyle}>
          <Typography
            variant="h4"
            style={{
              color: "#9c27b0",
              fontFamily: "Times New Roman",
              textShadow: "5px 5px 8px rgba(0.5, 0.5, 0.5, 0.3)",
            }}
          >
            <strong>Welcome to our Job Portal</strong>
          </Typography>
          <Typography
            variant="h5"
            style={{
              marginTop: "20px",
              color: "#7b68ee",
              fontFamily: "Georgia, 'Times New Roman', Times, serif",
            }}
          >
            Find Your Dream Job
          </Typography>
          <Typography
            variant="body1"
            style={{ marginTop: "10px", color: "black" }}
          >
            Explore thousands of job listings in various industries and take the
            next step in your career.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: "10px", fontSize: "13px" }}
            component={Link}
            to="/joblistings"
          >
            Browse Jobs
          </Button>

          <Typography
            variant="h5"
            style={{
              marginTop: "30px",
              color: "#7b68ee",
              fontFamily: "Georgia, 'Times New Roman', Times, serif",
            }}
          >
            Manage Your Applications
          </Typography>
          <Typography
            variant="body1"
            style={{ marginTop: "10px", color: "black" }}
          >
            Keep track of your job applications, review their status, and stay
            updated on your job search journey.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: "10px", fontSize: "13px" }}
            component={Link}
            to="/appliedjobs"
          >
            Applied Jobs
          </Button>
        </Paper>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Paper style={paperStyle1}>
          <Typography
            variant="h6"
            style={{
              color: "black",
              fontFamily: "Georgia, 'Times New Roman', Times, serif",
              marginBottom: "10px",
            }}
          >
            Why Choose Our Job Portal?
          </Typography>
          <Accordion style={accordionStyle} expanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="body1"
                style={{
                  color: "#7b68ee",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                  marginTop: "-15px",
                }}
              >
                Easy Job Search
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" style={{ marginTop: "-30px" }}>
                Our user-friendly platform makes it easy to search for jobs,
                filter by criteria, and find the perfect match for your skills
                and goals.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion style={accordionStyle} expanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="body1"
                style={{
                  color: "#7b68ee",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                  marginTop: "-15px",
                }}
              >
                Real-Time Updates
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" style={{ marginTop: "-30px" }}>
                Stay updated with real-time job listings and notifications,
                ensuring you never miss a great opportunity.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion style={accordionStyle} expanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="body1"
                style={{
                  color: "#7b68ee",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                  marginTop: "-15px",
                }}
              >
                Career Resources
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" style={{ marginTop: "-30px" }}>
                Access career resources, tips, and advice to enhance your job
                search and career development.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Box>
    </div>
  );
}

export default UserHome;
