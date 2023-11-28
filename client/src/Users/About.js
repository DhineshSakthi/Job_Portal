import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import LayoutUser from "./LayoutUser";

const containerStyle = {
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  marginTop: "-30px",
  height: "200px",
};

const paperStyle = {
  padding: "0.5rem",
};

const AboutUs = () => {
  return (
    <div style={{ backgroundColor: "#B0C4DE", minHeight: "100vh" }}>
      <LayoutUser />
      <Container maxWidth="md" style={containerStyle}>
        <Paper style={paperStyle}>
          <Typography
            gutterBottom
            sx={{ fontFamily: "Times New Roman", fontSize: "25px" }}
          >
            <strong>About Our Job Portal</strong>
          </Typography>
          <Typography paragraph fontSize="15px">
            Welcome to our job portal platform. We are dedicated to helping job
            seekers and employers connect, making the job search process
            efficient and effective.
          </Typography>
          <Typography paragraph fontSize="15px">
            Our mission is to empower job seekers by providing a user-friendly
            platform to search for job opportunities, apply with ease, and
            manage their job applications. At the same time, we assist employers
            in finding the right talent to drive their businesses forward.
          </Typography>
          <Typography paragraph fontSize="15px">
            What sets us apart:
            <ul>
              <li>
                Wide Range of Job Listings: We offer a diverse range of job
                listings across various industries and locations.
              </li>
              <li>
                Easy Application Process: Applying for jobs is simple and
                convenient, saving you time.
              </li>
              <li>
                Resume Builder: Our platform includes tools to help you create a
                compelling resume.
              </li>
              <li>
                Job Alerts: Stay updated with the latest job openings that match
                your criteria.
              </li>
              <li>
                Employer Services: We provide comprehensive services to
                employers, from posting jobs to managing applications.
              </li>
            </ul>
          </Typography>
          <Typography paragraph fontSize="15px">
            We are committed to fostering a strong job-seeking community and
            supporting the growth of businesses by connecting them with top
            talent. Whether you are a recent graduate looking for your first job
            or an experienced professional seeking a career change, our job
            portal is here to serve you.
          </Typography>
          <Typography paragraph fontSize="15px">
            Thank you for choosing our platform. Your success is our priority.
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default AboutUs;
