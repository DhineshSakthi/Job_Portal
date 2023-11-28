import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Pagination,
  Stack,
  Tooltip,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { fetchSkills, fetchCities, fetchStates } from "../util/dropdown";
import Axios from "axios";
import LayoutAdmin from "./LayoutAdmin";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LocationOnTwoToneIcon from "@mui/icons-material/LocationOnTwoTone";
import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import CsvUploadComponent from "../Admin/CsvUpload";
import EditJobDialog from "./EditJob";

const cardStyle = {
  marginTop: "10px",
  marginBottom: "5px",
  maxHeight: "185px",
  maxWidth: "270px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  overflow: "hidden",
};

const searchBarStyle = {
  position: "absolute",
  top: "80px",
  left: "15%",
  transform: "translateX(-50%)",
  width: "260px",
  height: "40px",
  backgroundColor: "white",
  borderRadius: "5px",
  padding: "2px",
};

const FilterBarStyle = {
  position: "absolute",
  top: "80px",
  right: "12%",
  transform: "translateX(-50%)",
  width: "130px",
  height: "40px",
  backgroundColor: "white",
  borderRadius: "5px",
  padding: "2px",
};

const buttonStyle = {
  position: "absolute",
  top: "87px",
  right: "6%",
  transform: "translateX(-50%)",
  minWidth: "10px",
};

const buttonStyle1 = {
  position: "absolute",
  top: "87px",
  right: "3.5%",
  transform: "translateX(-50%)",
  minWidth: "10px",
};

const buttonStyle3 = {
  position: "absolute",
  top: "87px",
  left: "28%",
  transform: "translateX(-50%)",
  minWidth: "10px",
  height: "30px",
};

const paginationStyle = {
  position: "fixed",
  bottom: "10px",
  left: "50%",
  transform: "translateX(-50%)",
};

const OurJobs = () => {
  const [adminJobs, setAdminJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const [deleteJob, setDeleteJob] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewMoreJob, setViewMoreJob] = useState(null);
  const [isViewMoreDialogOpen, setIsViewMoreDialogOpen] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [stateCode, setStateCode] = useState("");
  const [predefinedSkills, setPredefinedSkills] = useState([]);
  const fetchedSkills = predefinedSkills.flat();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 8;
  const [statusFilter, setStatusFilter] = useState("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStates(setStateOptions);
  }, []);

  useEffect(() => {
    if (stateCode) {
      fetchCities(stateCode, setCityOptions);
    }
  }, [stateCode]);

  const retrieveJobsByAdminId = async () => {
    setLoading(true);
    try {
      const adminId = JSON.parse(localStorage.getItem("object_id"));
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await Axios.get(
        `/admin/${adminId}?title=${searchQuery}&page=${currentPage}&perPage=${jobsPerPage}&status=${statusFilter}`,
        { headers }
      );

      if (response.status === 200) {
        const { jobPostings, totalPages, currentPage } = response.data;
        setAdminJobs(jobPostings);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
        setLoading(false);
      } else {
        console.error("Error retrieving jobs with status:", response.status);
      }
    } catch (error) {
      console.error("Error retrieving jobs:", error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchButtonClick = () => {
    if (e.key === 'Enter') {
      retrieveJobsByAdminId();
    }else{
      retrieveJobsByAdminId();
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      retrieveJobsByAdminId();
    }
  }, [searchQuery]);

  const handleResetSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    retrieveJobsByAdminId();
  };

  const handleDeleteClick = (job) => {
    setDeleteJob(job);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    fetch(`/admin/${deleteJob._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobStatus: "inactive" }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsDeleteDialogOpen(false);
        retrieveJobsByAdminId();
      })
      .catch((error) => {
        console.error("Error inactivate job:", error);
      });
  };

  const handleUploadOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleEditCloseDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditClick = (job) => {
    setEditJob(job);
    setIsEditDialogOpen(true);
    if (job.state) {
      const selectedState = stateOptions.find(
        (state) => state.name === job.state
      );
      if (selectedState) {
        setStateCode(selectedState.iso2);
      }
    }
  };

  const handleViewMoreClick = (job) => {
    setViewMoreJob(job);
    setIsViewMoreDialogOpen(true);
  };

  const handleCloseViewMore = () => {
    setIsViewMoreDialogOpen(false);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchSkills(setPredefinedSkills);
    retrieveJobsByAdminId();
  }, [statusFilter, currentPage]); // Re-fetch when searchQuery or currentPage changes

  return (
    <Grid style={{ backgroundColor: "#B0C4DE", minHeight: "100vh" }}>
      <LayoutAdmin />
      <Container style={{ paddingBottom: "25px", maxWidth: "95%" }}>
        <Grid
          sx={{
            marginTop: "-20px",
            marginBottom: "15px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "black",
              textAlign: "center",
              fontFamily: "Times New Roman",
              textShadow: "5px 5px 15px rgba(0, 0, 0, 0.5)",
            }}
          >
            Your Posted Jobs
          </Typography>
          <TextField
            label="Search by Job Title"
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            style={searchBarStyle}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchButtonClick} size="small">
                    <SearchTwoToneIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={buttonStyle3}
            onClick={handleResetSearch}
          >
            {" "}
            <Tooltip title="Reset search">
              <RefreshIcon fontSize="small" />
            </Tooltip>
          </Button>
          <FormControl sx={FilterBarStyle} size="small">
            <InputLabel htmlFor="Status">Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={statusFilter}
              variant="outlined"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="active">Active Jobs</MenuItem>
              <MenuItem value="inactive">Deleted Jobs</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={buttonStyle}
            component={Link}
            to="/jobadmin"
          >
            Post Job
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={buttonStyle1}
            onClick={handleUploadOpen}
          >
            <Tooltip title="Upload CSV">
              <UploadFileIcon />
            </Tooltip>
          </Button>
        </Grid>
        <Grid
          container
          spacing={2}
          display="flex"
          justifyContent="flex-start"
          sx={{ marginTop: "-10px" }}
        >
          {loading ? (
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{
                alignContent: "center",
                marginLeft: "50%",
                marginTop: "50px",
              }}
            >
              Loading...
            </Typography>
          ) : adminJobs.length === 0 ? (
            <Typography
              variant="h5"
              color="textSecondary"
              sx={{
                marginTop: "100px",
                alignContent: "center",
                marginLeft: "45%",
              }}
            >
              No results found
            </Typography>
          ) : (
            adminJobs.map((job) => (
              <Grid item md={3} key={job._id}>
                <Card
                  variant="outlined"
                  sx={cardStyle}
                  style={{ backgroundColor: "#f5f5f5" }}
                >
                  <CardContent>
                    <Typography
                      style={{
                        marginBottom: "10px",
                        marginTop: "-10px",
                        fontFamily: "serif",
                        fontSize: "18px",
                      }}
                    >
                      <strong>{job.jobTitle}</strong>
                    </Typography>

                    <Typography
                      style={{
                        marginBottom: "-5px",
                        fontSize: "14px",
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                      }}
                    >
                      <strong style={{ gridColumn: "1", paddingRight: "8px" }}>
                        <LocationOnTwoToneIcon />
                      </strong>
                      <span style={{ gridColumn: "2" }}>
                        {job.city}, {job.state}
                      </span>
                    </Typography>

                    <Typography
                      style={{
                        marginBottom: "-5px",
                        fontSize: "14px",
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                      }}
                    >
                      <strong style={{ gridColumn: "1", paddingRight: "8px" }}>
                        <CurrencyRupeeTwoToneIcon />
                      </strong>
                      <span style={{ gridColumn: "2" }}>{job.salaryRange}</span>
                    </Typography>

                    <Typography
                      style={{
                        marginBottom: "-5px",
                        fontSize: "14px",
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                      }}
                    >
                      <strong style={{ gridColumn: "1", paddingRight: "8px" }}>
                        <CalendarMonthTwoToneIcon />
                      </strong>
                      <span style={{ gridColumn: "2" }}>
                        {moment(job.applicationDeadline).format("MMM Do YY")}
                      </span>
                    </Typography>

                    <Typography
                      style={{
                        marginBottom: "-4px",
                        fontSize: "14px",
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                      }}
                    >
                      <strong style={{ gridColumn: "1", paddingRight: "8px" }}>
                        <AccountCircleTwoToneIcon />
                      </strong>
                      <span style={{ gridColumn: "2" }}>
                        {job.employerName}
                      </span>
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0}
                      justifyContent="flex-end" // Align buttons to the right
                    >
                      <Button
                        onClick={() => handleViewMoreClick(job)}
                        color="primary"
                      >
                        <Tooltip title="View more">
                          <VisibilityIcon />
                        </Tooltip>
                      </Button>
                      <Button
                        onClick={() => handleEditClick(job)}
                        color="success"
                        disabled={job.jobStatus === "inactive"}
                      >
                        <Tooltip title="Edit">
                          <EditIcon />
                        </Tooltip>
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(job)}
                        color="secondary"
                        disabled={job.jobStatus === "inactive"}
                      >
                        <Tooltip title="Delete">
                          <DeleteIcon />
                        </Tooltip>
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        <Grid item xs={12} sm={6} md={6}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, newPage) => setCurrentPage(newPage)}
            color="primary"
            size="small"
            style={paginationStyle}
          />
        </Grid>
        <Dialog open={open} onClose={handleCloseDialog}>
          <CsvUploadComponent open={open} onClose={handleCloseDialog} />
        </Dialog>

        <Dialog open={isEditDialogOpen} onClose={handleEditCloseDialog}>
          <EditJobDialog
            open={isEditDialogOpen}
            onClose={handleEditCloseDialog}
            editJob={editJob}
            setEditJob={setEditJob}
            retrieveJobsByAdminId={retrieveJobsByAdminId}
            stateOptions={stateOptions}
            stateCode={stateCode}
            cityOptions={cityOptions}
            fetchedSkills={fetchedSkills}
          />
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this job posting?
              <br />
              This action will mark the job as inactive.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isViewMoreDialogOpen}
          onClose={handleCloseViewMore}
          fullWidth={true}
          maxWidth="xs"
        >
          <DialogTitle variant="h6">Job Details</DialogTitle>
          <DialogContent>
            <Typography style={{ marginBottom: "5px" }}>
              <strong>Description:</strong> {viewMoreJob?.jobDescription}
            </Typography>
            <Typography style={{ marginBottom: "5px" }}>
              <strong>Job Type:</strong> {viewMoreJob?.jobType}
            </Typography>
            <Typography>
              <strong>Required Skills:</strong>
            </Typography>
            <ul>
              {viewMoreJob?.requiredSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewMore} color="primary" size="small">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Grid>
  );
};

export default OurJobs;
