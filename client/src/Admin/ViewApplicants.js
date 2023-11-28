import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Pagination,
  Grid,
  Card,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LayoutAdmin from "./LayoutAdmin";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ResumeViewer from "./ResumeViewer";
import MobileResumeViewer from "./mobileResume";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import RefreshIcon from "@mui/icons-material/Refresh";
import { isMobile } from "react-device-detect";

const searchBarStyle = {
  position: "absolute",
  top: "100px",
  left: "17.5%",
  transform: "translateX(-50%)",
  width: "260px",
  backgroundColor: "white",
  borderRadius: "5px",
  padding: "5px",
};

const searchBarStyleMobile = {
  position: "absolute",
  top: "80px",
  left: "30%",
  transform: "translateX(-50%)",
  width: "200px",
  backgroundColor: "white",
  borderRadius: "5px",
  padding: "2px",
};

const FilterBarStyle = {
  position: "absolute",
  top: "100px",
  right: "5.5%",
  transform: "translateX(-50%)",
  width: "150px",
  backgroundColor: "white",
  borderRadius: "5px",
  padding: "5px",
};

const FilterBarStyleMobile = {
  position: "absolute",
  top: "130px",
  left: "30%",
  transform: "translateX(-50%)",
  width: "200px",
  backgroundColor: "white",
  borderRadius: "5px",
  padding: "2px",
};

const buttonStyle = {
  position: "absolute",
  top: "110px",
  right: "5%",
  minWidth: "12px",
  transform: "translateX(-50%)",
  width: "50px",
};
const buttonStyleMobile = {
  position: "absolute",
  top: "140px",
  left: "66%",
  transform: "translateX(-50%)",
  minWidth: "10px",
};

const buttonStyleMobile1 = {
  position: "absolute",
  top: "88px",
  left: "66%",
  transform: "translateX(-50%)",
  minWidth: "10px",
};

const buttonStyle2 = {
  position: "absolute",
  top: "110px",
  left: "30.5%",
  minWidth: "12px",
  transform: "translateX(-50%)",
};

const buttonStyleMobile2 = {
  position: "absolute",
  top: "88px",
  left: "80%",
  transform: "translateX(-50%)",
  minWidth: "10px",
};

const paginationStyle = {
  position: "fixed",
  bottom: "10px",
  left: "50%",
  transform: "translateX(-50%)",
};

const paginationStyleMobile = {
  marginTop: "auto",
  display: "flex",
  alignItems: "center",
  marginLeft: "6%",
};

const statusStyles = {
  reviewing: {
    color: "blue",
  },
  accepted: {
    color: "green",
  },
  rejected: {
    color: "red",
  },
};

const mobileListItemStyle = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E0E0E0",
  borderRadius: "8px",
  padding: "10px",
  margin: "15px",
  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
};

const ViewApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchClicked, setSearchClicked] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const [statusFilter, setStatusFilter] = useState("all");
  const [resumePath, setResumePath] = useState("");
  const [viewingResume, setViewingResume] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const admin_Id = JSON.parse(localStorage.getItem("object_id"));

  useEffect(() => {
    fetchAllApplicants(
      admin_Id,
      searchClicked,
      statusFilter || "",
      currentPage,
      itemsPerPage
    );
  }, [admin_Id, searchClicked, statusFilter, currentPage, itemsPerPage]);

  const fetchAllApplicants = async (adminId, query, status, page, perPage) => {
    setIsLoadingData(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await Axios.get(
        `/application/alljobs/${adminId}?title=${query}&status=${status}&page=${page}&perPage=${perPage}`,
        { headers }
      );

      if (response.status === 200) {
        const { applicants, totalPages, currentPage } = response.data;

        // Update the serial numbers based on the current page and items per page
        const serialStart = (currentPage - 1) * perPage + 1;
        applicants.forEach((applicant, index) => {
          applicant.serialNumber = serialStart + index;
        });

        setApplicants(applicants);
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
        setIsLoadingData(false);
      } else {
        console.error(
          "Error fetching application data with status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching application data:", error);
      setIsLoadingData(false);
    }
  };

  const handleAccept = (applicantId) => {
    fetch(`/application/${applicantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Accepted" }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOpenDialog(false);
        setViewingResume(false);
        updateApplicantStatus(applicantId, "Accepted");
      })
      .catch((error) => {
        console.error("Error accepting applicant:", error);
      });
  };

  const handleReject = (applicantId) => {
    fetch(`/application/${applicantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Rejected" }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOpenDialog(false);
        setViewingResume(false);
        updateApplicantStatus(applicantId, "Rejected");
      })
      .catch((error) => {
        console.error("Error rejecting applicant:", error);
      });
  };

  const updateApplicantStatus = (applicantId, newStatus) => {
    setApplicants((prevData) => {
      return prevData.map((applicant) => {
        if (applicant._id === applicantId) {
          return { ...applicant, status: newStatus };
        }
        return applicant;
      });
    });
  };

  const handleViewClick = (applicant) => {
    setSelectedApplicant(applicant);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchButtonClick = () => {
    if (searchQuery !== "") {
      setSearchClicked(searchQuery);
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      setSearchClicked(searchQuery);
    }
  }, [searchQuery]);

  const handleResetSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchAllApplicants();
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleViewResume = (applicant) => {
    setSelectedApplicant(applicant);
    setResumePath(applicant.resumePath);
    setIsLoadingResume(true);
    setViewingResume(true);
    setIsLoadingResume(false);
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const allApplicants = [];

    try {
      await fetchAllApplicants(
        admin_Id,
        searchQuery,
        statusFilter,
        1,
        itemsPerPage
      );

      let totalPages = Math.ceil(applicants.length / itemsPerPage);

      for (let page = 1; page <= totalPages; page++) {
        await fetchAllApplicants(
          admin_Id,
          searchQuery,
          statusFilter,
          page,
          itemsPerPage
        );

        allApplicants.push(...applicants);
      }

      if (allApplicants.length === 0) {
        alert(
          `No ${statusFilter || "All"} applicants found for generating a PDF.`
        );
      } else {
        for (let page = 0; page < totalPages; page++) {
          const pdfContent = [
            `Page ${page + 1} - List of ${statusFilter || "All"} Applicants`,
          ];

          allApplicants
            .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
            .forEach((applicant, index) => {
              pdfContent.push(`Applicant #${index + 1}`);
              pdfContent.push(`Name: ${applicant.name}`);
              pdfContent.push(`Job Type: ${applicant.jobTitle}`);
              pdfContent.push(`Email: ${applicant.email}`);
              pdfContent.push(`Phone Number: ${applicant.phoneNumber}`);
            });

          if (page > 0) {
            doc.addPage();
          }

          let position = 20;
          pdfContent.forEach((line) => {
            doc.text(line, 10, position);
            position += 10;
          });
        }

        doc.save(`${statusFilter || "All"}Applicants.pdf`);
      }
    } catch (error) {
      console.error("Error fetching application data:", error);
    }
  };

  return (
    <div>
      {isMobile ? (
        <div style={{ backgroundColor: "#B0C4DE", minHeight: "100vh" }}>
          <LayoutAdmin />
          <Grid>
            <TextField
              label="Search by Job Title"
              size="small"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              sx={searchBarStyleMobile}
            />
            <Button
              variant="contained"
              color="primary"
              sx={buttonStyleMobile1}
              size="small"
              onClick={handleSearchButtonClick}
            >
              <Tooltip title="search">
                <SearchTwoToneIcon fontSize="small" />
              </Tooltip>
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={buttonStyleMobile2}
              onClick={handleResetSearch}
            >
              {" "}
              <Tooltip title="Reset search">
                <RefreshIcon fontSize="small" />
              </Tooltip>
            </Button>
          </Grid>
          <Grid>
            <FormControl sx={FilterBarStyleMobile} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                variant="outlined"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Reviewing">Reviewing</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              style={buttonStyleMobile}
              size="small"
              onClick={generatePDF}
            >
              <Tooltip title="Download Pdf">
                <DownloadIcon fontSize="small" />
              </Tooltip>
            </Button>
          </Grid>
          <Grid>
            <Typography
              sx={{
                fontSize: "22px",
                marginTop: "70px",
                fontFamily: "Times New Roman",
                textAlign: "center",
              }}
            >
              <strong>View Applicants</strong>
            </Typography>
          </Grid>
          <Grid>
            {isLoadingData ? (
              <Typography variant="h6" color="textSecondary">
                Loading...
              </Typography>
            ) : applicants.length === 0 ? (
              <Grid>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ marginTop: "10px", textAlign: "center" }}
                >
                  <strong>
                    No Applicants found for the provided job title.
                  </strong>
                </Typography>
              </Grid>
            ) : (
              <Grid style={{ padding: "20px" }}>
                {applicants.length > 0 && (
                  <Grid>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(event, newPage) => setCurrentPage(newPage)}
                      color="primary"
                      shape="rounded"
                      size="small"
                      style={paginationStyleMobile}
                    />
                  </Grid>
                )}
                {applicants.map((applicant) => (
                  <Card key={applicant._id} style={mobileListItemStyle}>
                    <Typography
                      style={{
                        fontFamily: "Times New Roman",
                        marginBottom: "2px",
                      }}
                    >
                      <strong>Job Title:</strong> {applicant.jobTitle}
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: "Times New Roman",
                        marginBottom: "2px",
                      }}
                    >
                      <strong>Name:</strong> {applicant.name}
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: "Times New Roman",
                        marginBottom: "2px",
                      }}
                    >
                      <strong>Email:</strong> {applicant.email}
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: "Times New Roman",
                        marginBottom: "2px",
                      }}
                    >
                      <strong>Applied Date:</strong>{" "}
                      {new Date(applicant.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: "Times New Roman",
                        marginBottom: "10px",
                      }}
                    >
                      <strong>Status:</strong>{" "}
                      <span
                        style={statusStyles[applicant.status.toLowerCase()]}
                      >
                        {applicant.status}
                      </span>
                    </Typography>
                    <Button
                      onClick={() => handleViewClick(applicant)}
                      color="primary"
                      variant="contained"
                      size="small"
                      sx={{
                        marginLeft: "20px",
                        marginRight: "10px",
                        fontSize: "10px",
                        minWidth: "10px",
                      }}
                    >
                      View More
                    </Button>
                    <Button
                      onClick={() => handleViewResume(applicant)}
                      color="primary"
                      variant="contained"
                      size="small"
                      sx={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        fontSize: "10px",
                        minWidth: "10px",
                      }}
                    >
                      View Resume
                    </Button>
                  </Card>
                ))}
              </Grid>
            )}
          </Grid>

          <Dialog
            open={viewingResume}
            onClose={() => setViewingResume(false)}
            fullWidth={true}
            maxWidth="sm"
            PaperProps={{
              style: {
                height: "60vh",
              },
            }}
          >
            {selectedApplicant && (
              <>
                <DialogTitle
                  variant="h6"
                  sx={{ fontFamily: "Times New Roman" }}
                >
                  <strong>Applicant's Resume</strong>
                  <Button
                    onClick={() => setViewingResume(false)}
                    sx={{
                      position: "absolute",
                      top: "8",
                      right: "0",
                      color: "black",
                    }}
                  >
                    X
                  </Button>
                </DialogTitle>
                <DialogContent>
                  {isLoadingResume ? (
                    <p>Loading resume...</p>
                  ) : resumePath ? (
                    <MobileResumeViewer resumePath={resumePath} />
                  ) : (
                    <Typography variant="h6">
                      <strong>
                        No resume found for this applicant. Click view more to
                        see the applicant details
                      </strong>
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleAccept(selectedApplicant._id)}
                    disabled={selectedApplicant.status === "Accepted"}
                    sx={{ fontSize: "10px" }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleReject(selectedApplicant._id)}
                    disabled={selectedApplicant.status === "Rejected"}
                    sx={{ fontSize: "10px" }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => setViewingResume(false)}
                    sx={{ fontSize: "10px" }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            fullWidth={true}
            maxWidth="sm"
            PaperProps={{
              style: {
                height: "50vh",
              },
            }}
          >
            {selectedApplicant && (
              <>
                <DialogTitle
                  sx={{ fontFamily: "Times New Roman", fontSize: "20px" }}
                >
                  <strong>Applicant Details</strong>
                  <Button
                    onClick={handleCloseDialog}
                    sx={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      color: "black",
                    }}
                  >
                    X
                  </Button>
                </DialogTitle>
                <DialogContent>
                  <Typography variant="body1">
                    <strong>Personal Info:</strong>
                  </Typography>
                  <Typography>Name: {selectedApplicant.name}</Typography>
                  <Typography>Email: {selectedApplicant.email}</Typography>
                  <Typography>
                    PhoneNumber: {selectedApplicant.phoneNumber}
                  </Typography>
                  <Typography style={{ marginBottom: "5px" }}>
                    Location: {selectedApplicant.location}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Education:</strong>
                  </Typography>
                  <Typography>
                    12th Percentage: {selectedApplicant.schoolPercentage}
                  </Typography>
                  <Typography>
                    Degree: {selectedApplicant.collegeDegree}
                  </Typography>
                  <Typography>
                    Domain: {selectedApplicant.fieldOfStudy}
                  </Typography>
                  <Typography style={{ marginBottom: "5px" }}>
                    UG/PG Percentage: {selectedApplicant.collegePercentage}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Skills:</strong>
                  </Typography>
                  <ul>
                    {selectedApplicant.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                  <Typography style={{ marginBottom: "3px" }}>
                    <strong>Experience:</strong> {selectedApplicant.experience}
                  </Typography>
                  <Typography style={{ marginBottom: "3px" }}>
                    <strong>Projects:</strong> {selectedApplicant.projects}
                  </Typography>
                  <Typography style={{ marginBottom: "3px" }}>
                    <strong>Certifications:</strong>{" "}
                    {selectedApplicant.certifications}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleAccept(selectedApplicant._id)}
                    disabled={selectedApplicant.status === "Accepted"}
                    sx={{ fontSize: "10px" }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleReject(selectedApplicant._id)}
                    disabled={selectedApplicant.status === "Rejected"}
                    sx={{ fontSize: "10px" }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={handleCloseDialog}
                    sx={{ fontSize: "10px" }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </div>
      ) : (
        <Grid style={{ backgroundColor: "#B0C4DE", minHeight: "100vh" }}>
          <LayoutAdmin />
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              margin: "20px",
            }}
          >
            <TextField
              label="Search by Job Title"
              size="small"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              style={searchBarStyle}
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
              sx={buttonStyle2}
              onClick={handleResetSearch}
            >
              {" "}
              <Tooltip title="Reset search">
                <RefreshIcon fontSize="small" />
              </Tooltip>
            </Button>
            <FormControl sx={FilterBarStyle} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                variant="outlined"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Reviewing">Reviewing</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              style={buttonStyle}
              size="small"
              onClick={generatePDF}
            >
              <Tooltip title="Download Pdf">
                <DownloadIcon fontSize="small" />
              </Tooltip>
            </Button>
          </Grid>
          <Grid sx={{ marginTop: "70px" }}>
            {isLoadingData ? (
              <Typography
                variant="h6"
                color="textSecondary"
                sx={{ alignContent: "center", marginLeft: "50%"}}
              >
                Loading...
              </Typography>
            ) : applicants.length === 0 ? (
              <Typography
                variant="h6"
                color="textSecondary"
                sx={{ marginTop: "10px", marginLeft: "480px" }}
              >
                <strong>No Applicants found for the provided job title.</strong>
              </Typography>
            ) : (
              <TableContainer
                component={Paper}
                style={{
                  width: "1100px",
                  margin: "0 auto",
                  overflowY: "auto",
                  marginTop: "-15px",
                }}
              >
                <Table sx={{ minWidth: 350 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        S.No
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        Job Title
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        Applied Date
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        Applicant Name
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        Applicant details
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "12px",
                        }}
                      >
                        Resume
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applicants.map((applicant) => (
                      <TableRow key={applicant._id}>
                        <TableCell align="left" style={{ fontSize: "12px" }}>
                          {applicant.serialNumber}
                        </TableCell>
                        <TableCell align="left" style={{ fontSize: "12px" }}>
                          {applicant.jobTitle}
                        </TableCell>
                        <TableCell align="left" style={{ fontSize: "12px" }}>
                          {new Date(applicant.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="left" style={{ fontSize: "12px" }}>
                          {applicant.name}
                        </TableCell>
                        <TableCell align="left" style={{ fontSize: "12px" }}>
                          {applicant.email}
                        </TableCell>
                        <TableCell align="left" style={{ fontSize: "12px" }}>
                          <span
                            style={statusStyles[applicant.status.toLowerCase()]}
                          >
                            {applicant.status}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            color="primary"
                            size="small"
                            onClick={() => handleViewClick(applicant)}
                          >
                            <Tooltip title="View More">
                              <VisibilityIcon sx={{ fontSize: 20 }} />
                            </Tooltip>
                          </Button>
                        </TableCell>
                        <TableCell align="left">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ fontSize: "9px" }}
                            onClick={() => handleViewResume(applicant)}
                          >
                            View Resume
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>

          <Dialog
            open={viewingResume}
            onClose={() => setViewingResume(false)}
            fullWidth={true}
            maxWidth="md"
            PaperProps={{
              style: {
                height: "1000vh",
              },
            }}
          >
            {selectedApplicant && (
              <>
                <DialogTitle
                  variant="h5"
                  sx={{ fontFamily: "Times New Roman" }}
                >
                  <strong>Applicant's Resume</strong>
                  <Button
                    onClick={() => setViewingResume(false)}
                    sx={{
                      position: "absolute",
                      top: "8",
                      right: "0",
                      color: "black",
                    }}
                  >
                    X
                  </Button>
                </DialogTitle>
                <DialogContent>
                  {isLoadingResume ? (
                    <p>Loading resume...</p>
                  ) : resumePath ? (
                    <ResumeViewer resumePath={resumePath} />
                  ) : (
                    <Typography variant="h6">
                      <strong>
                        No resume found for this applicant. Click view more to
                        see the applicant details
                      </strong>
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleAccept(selectedApplicant._id)}
                    disabled={selectedApplicant.status === "Accepted"}
                    sx={{ fontSize: "10px" }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleReject(selectedApplicant._id)}
                    disabled={selectedApplicant.status === "Rejected"}
                    sx={{ fontSize: "10px" }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => setViewingResume(false)}
                    sx={{ fontSize: "10px" }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            fullWidth={true}
            maxWidth="sm"
            PaperProps={{
              style: {
                height: "90vh",
              },
            }}
          >
            {selectedApplicant && (
              <>
                <DialogTitle
                  sx={{ fontFamily: "Times New Roman", fontSize: "20px" }}
                >
                  <strong>Applicant Details</strong>
                  <Button
                    onClick={handleCloseDialog}
                    sx={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      color: "black",
                    }}
                  >
                    X
                  </Button>
                </DialogTitle>
                <DialogContent>
                  <Typography variant="body1">
                    <strong>Personal Info:</strong>
                  </Typography>
                  <Typography>Name: {selectedApplicant.name}</Typography>
                  <Typography>Email: {selectedApplicant.email}</Typography>
                  <Typography>
                    PhoneNumber: {selectedApplicant.phoneNumber}
                  </Typography>
                  <Typography style={{ marginBottom: "5px" }}>
                    Location: {selectedApplicant.location}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Education:</strong>
                  </Typography>
                  <Typography>
                    12th Percentage: {selectedApplicant.schoolPercentage}
                  </Typography>
                  <Typography>
                    Degree: {selectedApplicant.collegeDegree}
                  </Typography>
                  <Typography>
                    Domain: {selectedApplicant.fieldOfStudy}
                  </Typography>
                  <Typography style={{ marginBottom: "5px" }}>
                    UG/PG Percentage: {selectedApplicant.collegePercentage}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Skills:</strong>
                  </Typography>
                  <ul>
                    {selectedApplicant.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                  <Typography style={{ marginBottom: "3px" }}>
                    <strong>Experience:</strong> {selectedApplicant.experience}
                  </Typography>
                  <Typography style={{ marginBottom: "3px" }}>
                    <strong>Projects:</strong> {selectedApplicant.projects}
                  </Typography>
                  <Typography style={{ marginBottom: "3px" }}>
                    <strong>Certifications:</strong>{" "}
                    {selectedApplicant.certifications}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleAccept(selectedApplicant._id)}
                    disabled={selectedApplicant.status === "Accepted"}
                    sx={{ fontSize: "10px" }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleReject(selectedApplicant._id)}
                    disabled={selectedApplicant.status === "Rejected"}
                    sx={{ fontSize: "10px" }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={handleCloseDialog}
                    sx={{ fontSize: "10px" }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
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
        </Grid>
      )}
    </div>
  );
};

export default ViewApplicants;
