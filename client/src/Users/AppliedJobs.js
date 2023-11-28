import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  TextField,
  Tooltip,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import LayoutUser from "./LayoutUser";
import RefreshIcon from "@mui/icons-material/Refresh";
import { showSwalError } from "../util/validation";
import { handleLogoutAndRedirect } from "../Components/logout";

const FilterBarStyle = {
  position: "absolute",
  top: "100px",
  right: "30px",
  transform: "translateX(-50%)",
  width: "200px",
  backgroundColor: "white",
  borderRadius: "5px",
  padding: "5px",
};

const dateFilterStyle = {
  position: "absolute",
  top: "100px",
  left: "19%",
  transform: "translateX(-70%)",
  width: "143px",
  backgroundColor: "white",
  borderRadius: "5px",
  padding: "5px",
};

const endFilterStyle = {
  position: "absolute",
  top: "100px",
  left: "27%",
  transform: "translateX(-30%)",
  width: "143px",
  backgroundColor: "white",
  borderRadius: "5px",
  padding: "5px",
};

const buttonStyle = {
  position: "absolute",
  top: "110px",
  left: "37.5%",
  transform: "translateX(-30%)",
  fontSize: "12px",
};

const buttonStyle1 = {
  position: "absolute",
  top: "110px",
  left: "43%",
  minWidth: "12px",
  transform: "translateX(-30%)",
};

const paginationStyle = {
  position: "fixed",
  bottom: "10px",
  left: "50%",
  transform: "translateX(-50%)",
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
  "hiring closed": {
    color: "red",
  },
};

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const user_Id = JSON.parse(localStorage.getItem("object_id"));

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    fetchData("", "");
    setPage(1);
  };

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const fetchData = async (start, end) => {
    setIsLoadingData(true);

    try {
      const response = await fetch(
        `/application/${user_Id}?status=${statusFilter}&startDate=${start}&endDate=${end}&page=${page}&perPage=${perPage}`,
        { headers }
      );
  
      if (response.status === 403) {
        showSwalError(
          "Error",
          "Session expired! Please login",
          "error"
        ).then((result) => {
          if (result.isConfirmed) {
            handleLogoutAndRedirect(navigate);
          }
        });
        console.error("Error: Access denied (403)")
      } else if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        console.log(data.applications)
        setPage(data.page);
        setTotalPages(data.totalPages);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // useEffect(() => {
  //   fetchData("", "");
  // }, [user_Id, statusFilter || "", page, perPage]);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    fetchData("", "");
  }, [user_Id, statusFilter, page, perPage]);

  const generateSerialNumber = (index) => {
    return (page - 1) * perPage + index + 1;
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setPage(1);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setPage(1);
  };

  const handleFilterButton = () => {
    fetchData(startDate, endDate);
  };

  return (
    <Grid style={{ backgroundColor: "#B0C4DE", minHeight: "100vh" }}>
      <LayoutUser />
      <Grid style={{ marginBottom: "100px" }}>
        <FormControl sx={FilterBarStyle} size="small">
          <InputLabel>Status Filter</InputLabel>
          <Select
            label="Status Filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Reviewing">Reviewing</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="Start Date"
          size="small"
          value={startDate}
          onChange={handleStartDateChange}
          style={dateFilterStyle}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          type="date"
          label="End Date"
          size="small"
          value={endDate}
          onChange={handleEndDateChange}
          style={endFilterStyle}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleFilterButton}
          style={buttonStyle}
        >
          Filter
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={resetFilters}
          style={buttonStyle1}
        >
          <Tooltip title="Reset Date">
            <RefreshIcon fontSize="small" />
          </Tooltip>
        </Button>
      </Grid>
      {isLoadingData ? (
        <Typography
          style={{
            textAlign: "center",
            fontSize: "23px",
            fontFamily: "Times new Roman",
          }}
        >
          Loading...
        </Typography>
      ) : applications.length === 0 ? (
        <Grid
          style={{
            textAlign: "center",
            fontSize: "23px",
            fontFamily: "Times new Roman",
          }}
        >
          <strong>No Results Found</strong>
        </Grid>
      ) : (
        <TableContainer
          component={Paper}
          style={{
            width: "1000px",
            margin: "0 auto",
            marginTop: "-30px",
            overflowY: "auto",
          }}
        >
          <Table>
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
                  Company Name
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
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application, index) => (
                <TableRow key={application._id}>
                  <TableCell style={{ fontSize: "12px" }}>
                    {generateSerialNumber(index)}
                  </TableCell>
                  <TableCell align="left" style={{ fontSize: "12px" }}>
                    {application.job_id?.object_id?.jobTitle || "N/A"}
                  </TableCell>
                  <TableCell align="left" style={{ fontSize: "12px" }}>
                    {application.job_id?.object_id?.admin?.companyName || "N/A"}
                  </TableCell>
                  <TableCell align="left" style={{ fontSize: "12px" }}>
                    {new Date(application.createdAt).toDateString()}
                  </TableCell>
                  <TableCell align="left" style={{ fontSize: "12px" }}>
                    <span
                      style={statusStyles[application.status.toLowerCase()]}
                    >
                      {application.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Grid>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, newPage) => setPage(newPage)}
          color="primary"
          size="small"
          style={paginationStyle}
        />
      </Grid>
    </Grid>
  );
};

export default AppliedJobs;
