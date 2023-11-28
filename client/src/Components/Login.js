import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import "../css/Home.css";
import { GoogleLogin } from "@react-oauth/google";
import { handleLogin, handleGoogleLoginSuccess } from "../util/authService";

const Login = () => {
  const location = useLocation();
  const role = location.state ? location.state.role : null;
  const navigate = useNavigate();

  function navigateToRegister() {
    console.log(role);
    navigate("/register", { state: { role } });
  }

  function navigateToResetPassword() {
    navigate("/password-forgot");
  }

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [commonError, setCommonError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setCommonError("Username and password are required.");
    } else {
      setCommonError("");
      handleLogin(formData, navigate, setCommonError);
    }
  };

  const handleGoogleLogin = (response) => {
    handleGoogleLoginSuccess(response, navigate, setCommonError, role);
  };

  const handleGoogleLoginFailure = () => {
    console.log("Login Failed");
  };

  return (
    <div className="home-page">
      <br />
      <Container style={{ marginTop: "70px", width: "380px" }}>
        <Paper
          elevation={10}
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            style={{
              fontFamily: "Times New Roman",
            }}
          >
            <LockOpenIcon
              style={{ marginRight: "7px", marginBottom: "-2px" }}
            />
            <strong>Login</strong>
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            {commonError && (
              <Typography color="error" variant="body2" gutterBottom>
                {commonError}
              </Typography>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  required
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: "10px" }}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: "10px" }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              size="small"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "1rem",
                fontFamily: "Times New Roman",
                marginBottom: "10px",
              }}
            >
              <strong>Login</strong>
            </Button>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleLoginFailure}
            />
            <Grid container justifyContent="flex" sx={{ marginTop: "0.5rem" }}>
              <Grid item>
                <Typography
                  style={{
                    fontFamily: "Times New Roman",
                    fontSize: "17px",
                  }}
                >
                  Don't have an account?
                  <Button
                    style={{ fontSize: "12px" }}
                    onClick={navigateToRegister}
                    color="primary"
                    size="small"
                  >
                    Register here
                  </Button>
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  style={{
                    fontFamily: "Times New Roman",
                    fontSize: "17px",
                  }}
                >
                  Forgot Password?
                  <Button
                    style={{ fontSize: "12px" }}
                    onClick={navigateToResetPassword}
                    color="primary"
                    size="small"
                  >
                    Click here
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
