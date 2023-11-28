import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import LayoutAdmin from "./LayoutAdmin";

const containerStyle = {
  marginTop: "-15px",
  paddingBottom: "1rem",
};

const paperStyle = {
  padding: "1.5rem",
};

const AboutJobProviders = () => {
  return (
    <div style={{ backgroundColor: "#B0C4DE", minHeight: "100vh" }}>
    <LayoutAdmin/>
    <Container maxWidth="md" style={containerStyle}>
      <Paper style={paperStyle}>
        <Typography gutterBottom sx={{ fontFamily: "Times New Roman", fontSize: "25px", marginTop: "-15px" }}>
          <strong>About Our Job Portal</strong>
        </Typography>
        <Typography paragraph fontSize="15px">
          Welcome to our job portal's section for job providers. We understand
          the importance of finding the right talent for your organization, and
          our platform is designed to simplify the hiring process for you.
        </Typography>
        <Typography paragraph fontSize="15px">
          Why choose our platform as your recruitment partner:
          <ul>
            <li>
              Diverse Talent Pool: Gain access to a diverse and highly skilled
              pool of job seekers from various backgrounds and experiences.
            </li>
            <li>
              User-Friendly Interface: Our platform offers an intuitive and
              easy-to-use interface for posting job listings and managing
              applications.
            </li>
            <li>
              Efficient Hiring Process: Streamline your recruitment process,
              saving time and resources.
            </li>
            <li>
              Applicant Tracking: Easily manage and track applicants throughout
              the hiring process.
            </li>
            <li>
              Customized Solutions: We offer customized recruitment solutions to
              meet your organization's unique needs.
            </li>
          </ul>
        </Typography>
        <Typography paragraph fontSize="15px">
          How to get started:
          <ol>
            <li>
              Register Your Company: Create an account and register your company
              on our platform.
            </li>
            <li>
              Post Job Listings: Use our user-friendly interface to post job
              listings, including detailed job descriptions and requirements.
            </li>
            <li>
              Manage Applications: Easily review and manage job applications
              from potential candidates.
            </li>
            <li>
              Find the Perfect Candidate: Identify and connect with top talent
              to fulfill your staffing needs.
            </li>
          </ol>
        </Typography>
        <Typography paragraph fontSize="15px">
          We are dedicated to helping you find the right candidates to drive
          your organization's success. Whether you are a small startup or a
          large enterprise, we are here to support your recruitment efforts.
        </Typography>
        <Typography paragraph fontSize="15px">
          Thank you for choosing our platform as your recruitment partner. We
          look forward to helping you build a talented team.
        </Typography>
      </Paper>
    </Container>
    </div>
  );
};

export default AboutJobProviders;
