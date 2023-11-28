import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  setUsername,
  setPassword,
  setConfirmPassword,
} from "../Reducers/login";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Accessing the Redux state
  const formData = useSelector((state) => ({
    username: state.login.username,
    password: state.login.password,
    confirmPassword: state.login.confirmPassword,
  }));

  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  //   confirmPassword: "",
  // });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Dispatching actions to update Redux state
    if (name === "username") {
      dispatch(setUsername(value));
    } else if (name === "password") {
      dispatch(setPassword(value));
    } else if (name === "confirmPassword") {
      dispatch(setConfirmPassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setRegistrationError(null);

    const validationErrors = {};

    if (
      !formData.username ||
      formData.username.length < 4 ||
      formData.username.length > 24
    ) {
      validationErrors.username = "Username must contain 4 to 24 letters only.";
    }

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

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const userId = JSON.parse(localStorage.getItem("object_id"));
        const response = await axios.put(`register/${userId}`, {
          username: formData.username,
          password: formData.password,
          companyName: formData.companyName,
        });

        if (response.status === 200) {
          setSubmitted(true);
          toast.success("Your registration was successful. Please Login", {
            position: "top-right",
          });
          setTimeout(() => {
            navigate("/userprofile");
          }, 300);
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
    <div
      style={{
        backgroundColor: "#B0C4DE",
        height: "100vh",
        paddingTop: "10px",
      }}
    >
      <Container maxWidth="xs">
        <Paper style={{ padding: "22px" }} elevation={1}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontFamily: "Times new roman", fontWeight: "bold" }}
          >
            Update Username & Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username ? true : false}
                  helperText={errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password ? true : false}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword ? true : false}
                  helperText={errors.confirmPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  color="primary"
                >
                  Update
                </Button>
              </Grid>
            </Grid>
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
              User details Update successful!
            </Typography>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default RegisterPage;
