import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper } from "@mui/material";
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { showSwalError } from "../util/validation";

const ResetPassword = () => {
  const navigate = useNavigate();
  const user = useParams();
  const userId = user.UserId;
  const token = user.token;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await Axios.put(
        `/register/password/${userId}`,
        { newPassword },
        { headers }
      );
      if (response.status === 200) {
        toast.success("Password reset successfully and Login here", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/login");
        }, 300);
      } else {
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 403) {
        showSwalError(
          "Error",
          "Password resest token expired! Reset with new link",
          "error"
        ).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      } else {
        setMessage(error.response.data.message);
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
            Reset Password
          </Typography>
          <form onSubmit={handleResetPassword}>
            <TextField
              label="Enter new password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm new password"
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="small"
            >
              Reset Password
            </Button>
          </form>
          {message && (
            <Typography color={message.includes("Error") ? "error" : "success"}>
              {message}
            </Typography>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default ResetPassword;
