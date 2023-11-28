import React, { useEffect, useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import LayoutAdmin from "./LayoutAdmin";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../css/Home.css";

function AdminProfile() {
  const [statistics, setStatistics] = useState({
    totalApplicantsToday: 0,
    totalApplicantsReviewing: 0,
    totalApplicantsAcceptedToday: 0,
    totalApplicantsRejectedToday: 0,
    totalApplicantsLastWeek: 0,
    totalApplicantsAcceptedLastWeek: 0,
    totalApplicantsRejectedLastWeek: 0,
    totalApplicantsOnWhole: 0,
    totalApplicantsAcceptedOnWhole: 0,
    totalApplicantsRejectedOnWhole: 0,
  });
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const paperStyle = {
    padding: "20px",
    margin: "20px auto",
    marginLeft: "50px",
    marginTop: "60px",
    maxWidth: "700px",
    height: "280px",
    backgroundColor: "#f5f5f5",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
  };

  const paperStyle1 = {
    padding: "5px",
    margin: "20px auto",
    marginRight: "50px",
    marginTop: "-350px",
    maxWidth: "800px",
    backgroundColor: "rgba(245, 245, 245, 0)",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0)",
    borderRadius: "8px",
  };

  const accordionStyle = {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    maxWidth: "500px",
    marginBottom: "7px",
  };

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null);
  };

  useEffect(() => {
    const adminId = JSON.parse(localStorage.getItem("object_id"));
    const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
    // Make an API request to fetch application statistics
    fetch(`/application/statistics/${adminId}`, {headers}) // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setStatistics(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="home-page">
      <LayoutAdmin />
      <Paper style={paperStyle}>
        <Typography
          variant="h4"
          style={{
            color: "#9c27b0",
            fontFamily: "Times New Roman",
            textShadow: "5px 5px 8px rgba(0.5, 0.5, 0.5, 0.3)",
            marginBottom: "25px",
          }}
        >
          <strong>Welcome to our Job Portal</strong>
        </Typography>
        <Typography variant="body1">
          Whether you're a company looking to hire top talent or an individual
          seeking the perfect job opportunity, you're in the right place.
        </Typography>
        <Typography variant="body1" style={{ marginTop: "20px" }}>
          Our platform connects job seekers with job posters, making the hiring
          process smoother and more efficient.
        </Typography>
        <Typography variant="body1" style={{ marginTop: "20px" }}>
          Get started by posting your job openings or exploring the latest job
          listings.
        </Typography>
        <Box display="flex" justifyContent="center" marginTop="20px">
          <Button
            component={Link}
            to="/jobadmin"
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: "50px" }}
          >
            Post a Job
          </Button>
          <Button
            component={Link}
            to="/ourjobs"
            variant="contained"
            color="primary"
            size="small"
          >
            Explore Jobs
          </Button>
        </Box>
      </Paper>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Paper style={paperStyle1}>
          <Typography
            style={{
              color: "#9c27b0",
              fontFamily: "Times New Roman",
              textShadow: "5px 5px 8px rgba(0.5, 0.5, 0.5, 0.3)",
              marginBottom: "10px",
              fontWeight: "bold",
              fontSize: "22px"
            }}
          >
            Applicants statistics
          </Typography>
          <Accordion
            style={accordionStyle}
            expanded={true}
            onChange={handleChangeAccordion("panel0")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                style={{
                  color: "black",
                  fontFamily: "Times New Roman",
                  fontSize: "18px",
                }}
              >
                <strong>Today's Statistics-</strong>
                <Link
                  to="/viewapplicants"
                  style={{ textDecoration: "none", color: "Blue" }}
                >
                  view applicants
                </Link>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <Typography sx={{ fontSize: "15px", marginTop: "-25px" }}>
                  Total Applicants Reviewing:{" "}
                  {statistics.totalApplicantsReviewing}
                </Typography>
                <Typography sx={{ fontSize: "15px" }}>
                  Total Applicants Applied Today:{" "}
                  {statistics.totalApplicantsToday}
                </Typography>

                <Typography sx={{ fontSize: "15px" }}>
                  Total Applicants Accepted Today:{" "}
                  {statistics.totalApplicantsAcceptedToday}
                </Typography>
                <Typography sx={{ fontSize: "15px" }}>
                  Total Applicants Rejected Today:{" "}
                  {statistics.totalApplicantsRejectedToday}
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            style={accordionStyle}
            expanded={expandedAccordion === "panel1"}
            onChange={handleChangeAccordion("panel1")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                style={{
                  color: "Black",
                  fontFamily: "Times New Roman",
                  fontSize: "18px",
                }}
              >
                <strong>Last Seven days Statistics</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <Typography sx={{ fontSize: "15px", marginTop: "-25px" }}>
                  Total Number of Applicants:{" "}
                  {statistics.totalApplicantsLastWeek}
                </Typography>
                <Typography sx={{ fontSize: "15px" }}>
                  Total Number of Accepted Applicants:{" "}
                  {statistics.totalApplicantsAcceptedLastWeek}
                </Typography>
                <Typography sx={{ fontSize: "15px" }}>
                  Total Applicants Rejected Today:{" "}
                  {statistics.totalApplicantsRejectedLastWeek}
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            style={accordionStyle}
            expanded={expandedAccordion === "panel2"}
            onChange={handleChangeAccordion("panel2")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="h6"
                style={{
                  color: "Black",
                  fontFamily: "Times New Roman",
                  fontSize: "18px",
                }}
              >
                <strong>Overall Statistics</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <Typography sx={{ fontSize: "15px", marginTop: "-25px" }}>
                  Total Number of Applicants:{" "}
                  {statistics.totalApplicantsOnWhole}
                </Typography>
                <Typography sx={{ fontSize: "15px" }}>
                  Total Number of Accepted Applicants:{" "}
                  {statistics.totalApplicantsAcceptedOnWhole}
                </Typography>
                <Typography sx={{ fontSize: "15px" }}>
                  Total Number of Rejected Applicants:{" "}
                  {statistics.totalApplicantsRejectedOnWhole}
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Box>
    </div>
  );
}

export default AdminProfile;
