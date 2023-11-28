import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  console.log(email);
  const [message, setMessage] = useState("");

  const handleResetRequest = async (event) => {
    event.preventDefault();
    try {
      const response = await Axios.post("/login/reset-password", { email });
      if (response.status === 200) {
        toast.success("Password reset link sent to your email", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/login");
        }, 300);
      } else if (response.status === 400) {
        toast.success("Invalid Email. Please give correct Email", {
          position: "top-right",
        });
      } else {
      }
    } catch (error) {
        console.log(error)
      if (error.response.status === 404) {
        toast.success("Invalid Email. Please give correct Email", {
          position: "top-right",
        });
      } else {
        setMessage("Error sending password reset link.");
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
      <Container maxWidth="sm">
        <Paper style={{ padding: "22px" }} elevation={1}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontFamily: "Times new roman",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Forgot Password
          </Typography>
          <form onSubmit={handleResetRequest}>
            <Grid item sx={{ marginBottom: "15px" }}>
              <TextField
                label="Enter your email"
                fullWidth
                required
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item sx={{ marginBottom: "15px" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                sx={{ marginRight: "10px" }}
              >
                Send Link
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => navigate("/login")}
              >
                Back
              </Button>
            </Grid>
          </form>
          <Grid item>
            <Typography variant="body1" color="secondary">
              {message}
            </Typography>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default ForgotPassword;
