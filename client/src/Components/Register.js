import React, { useState } from "react";
import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Grid,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

const Register = () => {
  const location = useLocation();
  console.log("location inside register page", location);
  const role = location.state ? location.state.role : null;
  console.log(role);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    companyName: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setRegistrationError(null);

    // Perform form validation
    const validationErrors = {};

    // Validate username
    if (
      !formData.username ||
      formData.username.length < 4 ||
      formData.username.length > 24
    ) {
      validationErrors.username = "Username must contain 4 to 24 letters only.";
    }

    // Validate email
    if (
      !formData.email ||
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)
    ) {
      validationErrors.email = "Please enter a valid email address.";
    }

    // Password validation: Must contain at least one special character and one number
    if (
      !formData.password ||
      !/[@#$%^&+=!]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      validationErrors.password =
        "Password must contain at least one special character (@#$%^&+=!) and one number.";
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    // Validate company name and location if role is admin
    if (role === "admin") {
      if (!formData.companyName) {
        validationErrors.companyName = "Company Name is required";
      }
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role,
          companyName: formData.companyName,
        });

        if (response.status === 200) {
          setSubmitted(true);
          toast.success("Your registration was successful. Please Login", {
            position: "top-right"
          })
          setTimeout(() => {
          navigate("/userprofile");
          }, 300)
        } else if (response.status === 409) {
          setRegistrationError(response.data.errorMessage);
          toast.error(response.data.errorMessage);
        } else {
          console.error("Registration failed with status:", response.status);
          setRegistrationError("An error occurred during registration.");
          toast.error("An error occurred during registration.");
        }
      } catch (error) {
        if (error.response && error.response.data.errorMessage) {
          setRegistrationError(error.response.data.errorMessage);
          toast.error(error.response.data.errorMessage);
        } else {
          console.error("An error occurred during registration:", error);
          setRegistrationError("An error occurred during registration.");
          toast.error("An error occurred during registration.");
        }
      }
    }
  };

  return (
    <div className="home-page">
      <br />
      <Container component="main" sx={{ marginTop: "60px", width: "400px" }}>
        <CssBaseline />
        <Paper
          elevation={10}
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            style={{
              fontFamily: "Times New Roman",
            }}
          >
            <strong>Register</strong>
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username ? true : false}
                  helperText={errors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {role === "Admin" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      label="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      error={errors.companyName ? true : false}
                      helperText={errors.companyName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CorporateFareIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email ? true : false}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password ? true : false}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Re-enter Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword ? true : false}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              size="small"
              fullWidth
              sx={{ marginTop: "1rem" }}
            >
              Register
            </Button>
          </form>
          {registrationError && (
            <Typography
              variant="body2"
              sx={{ color: "red", marginTop: "1rem" }}
            >
              {registrationError}
            </Typography>
          )}
          {submitted && (
            <Typography
              variant="body2"
              sx={{ color: "green", marginTop: "1rem" }}
            >
              Registration successful!
            </Typography>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Register;

