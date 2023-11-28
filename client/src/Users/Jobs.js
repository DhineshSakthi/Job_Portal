// import React, { useEffect, useState, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Container,
//   Grid,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Stack,
//   Pagination,
//   InputAdornment,
//   Tooltip,
//   IconButton,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import Axios from "axios";
// import LayoutUser from "./LayoutUser";
// import moment from "moment";
// import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import LocationOnTwoToneIcon from "@mui/icons-material/LocationOnTwoTone";
// import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";
// import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
// import { isMobile } from "react-device-detect";
// import { handleLogoutAndRedirect } from "../Components/logout";
// import { showSwalError } from "../util/validation";
// import "../css/mobilejobs.css";
// import "../css/desktopjobs.css";

// const buttonStyle = {
//   marginTop: "5px",
//   height: "25px",
//   minWidth: "15px",
//   fontSize: "10px",
// };

// const buttonStyle2 = {
//   marginTop: "5px",
//   height: "25px",
//   minWidth: "10px",
// };

// const JobListings = () => {
//   const navigate = useNavigate
//   const [jobListings, setJobListings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [query, setQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const jobsPerPage = 8;
//   const initialRender = useRef(true);

//   useEffect(() => {
//     if (initialRender.current) {
//       initialRender.current = false;
//       return;
//     }
//     fetchJobListings();
//   }, [currentPage]);

//   const fetchJobListings = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const headers = {
//         Authorization: `Bearer ${token}`,
//       };

//       const response = await Axios.get(
//         `admin?page=${currentPage}&perPage=${jobsPerPage}&title=${query}`,
//         { headers }
//       );
//       const { jobPostings, totalPages } = response.data;
//       setJobListings(jobPostings);
//       console.log(jobPostings)
//       setTotalPages(totalPages);
//       setLoading(false);
//     } catch (error) {
//       if (error.response && error.response.status === 403) {
//         showSwalError(
//           "Error",
//           "Session expired! Please login",
//           "error"
//         ).then((result) => {
//           if (result.isConfirmed) {
//             handleLogoutAndRedirect(navigate);
//           }
//         });
//         console.error("Error: Access denied (403)");
//       } else {
//         console.error("Error fetching job listings:", error);
//       }
//       setLoading(false);
//     }
//   };

//   const handleJobTitleChange = (e) => {
//     const newQuery = e.target.value || ''; // Ensure newQuery isn't undefined
//     setQuery(newQuery);
//   };

//   const handleSearchButtonClick = () => {
//     fetchJobListings();
//     setCurrentPage(1);
//   };

//   useEffect(() => {
//     if (query === '') {
//       fetchJobListings();
//     }
//   }, [query]);

//   const handlePageChange = (event, newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleResetSearch = () => {
//     setQuery("");
//     setCurrentPage(1);
//     fetchJobListings();
//   };

//   return (
//     <Grid>
//       <JobListingsContent
//         jobListings={jobListings}
//         query={query}
//         loading={loading}
//         totalPages={totalPages}
//         currentPage={currentPage}
//         handlePageChange={handlePageChange}
//         handleJobTitleChange={handleJobTitleChange}
//         handleSearchButtonClick={handleSearchButtonClick}
//         handleResetSearch={handleResetSearch}
//       />
//     </Grid>
//   );
// };

// const JobListingsContent = ({
//   jobListings,
//   query,
//   loading,
//   totalPages,
//   currentPage,
//   handlePageChange,
//   handleJobTitleChange,
//   handleSearchButtonClick,
//   handleResetSearch,
// }) => {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedJob, setSelectedJob] = useState(null);

//   const handleViewMoreClick = (job) => {
//     setSelectedJob(job);
//     setOpenDialog(true);
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//   };

//   return (
//     <Grid className={isMobile ? "mobile-Grid1" : "desktop-Grid1"}>
//       <LayoutUser />
//       <div className={isMobile ? "mobile-div2" : "desktop-div2"}>
//         <Container
//           className={isMobile ? "mobile-container1" : "desktop-container1"}
//         >
//           <div
//             className={
//               isMobile ? "mobile-searchBarStyle" : "desktop-searchBarStyle"
//             }
//           >
//             <TextField
//               label="Search by Job title/company"
//               variant="outlined"
//               size="small"
//               fullWidth
//               value={query}
//               onChange={handleJobTitleChange}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={handleSearchButtonClick} size="small">
//                       <SearchTwoToneIcon />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </div>
//           <Button
//             variant="contained"
//             color="primary"
//             size="small"
//             //sx={buttonStyle3}
//             className={isMobile ? "mobile-button2" : "desktop-button2"}
//             onClick={handleResetSearch}
//           >
//             {" "}
//             <Tooltip title="Reset search">
//               <RefreshIcon fontSize="small" />
//             </Tooltip>
//           </Button>
//           <div
//             className={isMobile ? "mobile-typography1" : "desktop-typography1"}
//           >
//             <Typography
//               fontFamily="Times new Roman"
//               fontSize={isMobile ? "20px" : "24px"}
//             >
//               <strong>Jobs Available</strong>
//             </Typography>
//           </div>
//           <Grid>
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               onChange={handlePageChange}
//               color="primary"
//               size="small"
//               className={isMobile ? "mobile-pagination" : "desktop-pagination"}
//             />
//           </Grid>{" "}
//           <Grid
//             container
//             spacing={2}
//             justifyContent={isMobile ? "center" : "flex-start"}
//           >
//             {loading ? (
//               <Grid sx={{ marginTop: "40px" }}>
//                 <Typography variant="h6" color="textSecondary">
//                   Loading...
//                 </Typography>
//               </Grid>
//             ) : jobListings && jobListings.length > 0 ? (
//               jobListings.map((job, index) => (
//                 <Grid item key={job._id} md={3}>
//                   <Card
//                     variant="soft"
//                     className={
//                       isMobile ? "mobile-cardStyle" : "desktop-cardStyle"
//                     }
//                   >
//                     <CardContent>
//                       <Typography
//                         style={{
//                           fontFamily: "serif",
//                           fontSize: "17px",
//                           marginTop: "-10px",
//                         }}
//                       >
//                         <strong>{job.jobTitle}</strong>
//                       </Typography>
//                       <Typography
//                         style={{ marginBottom: "10px", fontSize: "15px" }}
//                       >
//                         {job.admin.companyName}
//                       </Typography>
//                       <Typography
//                         style={{
//                           marginBottom: "-5px",
//                           fontSize: "14px",
//                           display: "grid",
//                           gridTemplateColumns: "auto 1fr",
//                         }}
//                       >
//                         <strong
//                           style={{ gridColumn: "1", paddingRight: "8px" }}
//                         >
//                           <LocationOnTwoToneIcon />
//                         </strong>
//                         <span style={{ gridColumn: "2" }}>
//                           {" "}
//                           {job.city}, {job.state}
//                         </span>
//                       </Typography>
//                       <Typography
//                         style={{
//                           marginBottom: "-5px",
//                           fontSize: "14px",
//                           display: "grid",
//                           gridTemplateColumns: "auto 1fr",
//                         }}
//                       >
//                         <strong
//                           style={{ gridColumn: "1", paddingRight: "8px" }}
//                         >
//                           <CurrencyRupeeTwoToneIcon />
//                         </strong>
//                         <span style={{ gridColumn: "2" }}>
//                           {" "}
//                           {job.salaryRange}
//                         </span>
//                       </Typography>
//                       <Typography
//                         style={{
//                           marginBottom: "-5px",
//                           fontSize: "14px",
//                           display: "grid",
//                           gridTemplateColumns: "auto 1fr",
//                         }}
//                       >
//                         <strong
//                           style={{ gridColumn: "1", paddingRight: "8px" }}
//                         >
//                           <CalendarMonthTwoToneIcon />
//                         </strong>
//                         <span style={{ gridColumn: "2" }}>
//                           {" "}
//                           {moment(job.applicationDeadline).format("MMM Do YY")}
//                         </span>
//                       </Typography>
//                       <Stack
//                         direction="row"
//                         spacing={2}
//                         justifyContent="flex-end"
//                       >
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           size="small"
//                           component={Link}
//                           to={`/application/${job._id}`}
//                           style={buttonStyle}
//                         >
//                           Apply
//                         </Button>
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           size="small"
//                           onClick={() => handleViewMoreClick(job)}
//                           style={buttonStyle2}
//                         >
//                           <Tooltip title="View more">
//                             <VisibilityIcon fontSize="11px" />
//                           </Tooltip>
//                         </Button>
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))
//             ) : (
//               <Grid
//                 container
//                 justifyContent="center"
//                 alignItems="center"
//                 sx={{ height: "50vh" }}
//               >
//                 <Typography variant="h6" color="textSecondary">
//                   No results found.
//                 </Typography>
//               </Grid>
//             )}
//           </Grid>
//         </Container>
//       </div>
//       {/* Job Details Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={handleDialogClose}
//         fullWidth={true}
//         maxWidth="xs"
//       >
//         {selectedJob && (
//           <>
//             <DialogTitle
//               sx={{ fontFamily: "Times New Roman", fontSize: "22px" }}
//             >
//               <strong>{selectedJob.jobTitle}</strong>
//               <Button
//                 onClick={() => setOpenDialog(false)}
//                 sx={{
//                   position: "absolute",
//                   top: "8",
//                   right: "0",
//                   color: "black",
//                 }}
//               >
//                 X
//               </Button>
//             </DialogTitle>
//             <DialogContent>
//               <Typography style={{ marginBottom: "3px", fontSize: "18px" }}>
//                 <strong>Company:</strong> {selectedJob.admin.companyName}
//               </Typography>
//               <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
//                 <strong>Description:</strong> {selectedJob.jobDescription}
//               </Typography>
//               <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
//                 <strong>Required Skills:</strong>
//                 <ul>
//                   {selectedJob.requiredSkills.map((skill, index) => (
//                     <li key={index}>{skill}</li>
//                   ))}
//                 </ul>
//               </Typography>
//               <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
//                 <strong> Salary: </strong>
//                 {selectedJob.salaryRange}
//               </Typography>
//               <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
//                 <strong> Job Type: </strong>
//                 {selectedJob.jobType}
//               </Typography>
//               <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
//                 <strong> Location:</strong> {selectedJob.city},{" "}
//                 {selectedJob.state}
//               </Typography>
//               <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
//                 <strong>Application Deadline:</strong>{" "}
//                 {new Date(selectedJob.applicationDeadline).toDateString()}
//               </Typography>
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 size="small"
//                 component={Link}
//                 to={`/application/${selectedJob._id}`}
//                 style={buttonStyle}
//               >
//                 Apply
//               </Button>
//               <Button size="small" onClick={handleDialogClose} color="primary">
//                 Close
//               </Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>
//     </Grid>
//   );
// };
// export default JobListings;

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Pagination,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import LayoutUser from "./LayoutUser";
import moment from "moment";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocationOnTwoToneIcon from "@mui/icons-material/LocationOnTwoTone";
import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
import { isMobile } from "react-device-detect";
import { handleLogoutAndRedirect } from "../Components/logout";
import { showSwalError } from "../util/validation";
import "../css/mobilejobs.css";
import "../css/desktopjobs.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setJobListings,
  setLoading,
  setQuery,
  setCurrentPage,
  setTotalPages,
  setOpenDialog,
  setSelectedJob,
  setPreviousQuery,
  clearQuery
} from "../Reducers/jobs";

const buttonStyle = {
  marginTop: "5px",
  height: "25px",
  minWidth: "15px",
  fontSize: "10px",
};

const buttonStyle2 = {
  marginTop: "5px",
  height: "25px",
  minWidth: "10px",
};

const JobListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    jobListings,
    loading,
    query,
    currentPage,
    totalPages,
    openDialog,
    selectedJob,
   // previousQuery,
  } = useSelector((state) => state.jobListings);

    const initialRender = useRef(true);
    const [previousQuery, setPreviousQuery] = useState('');

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    fetchJobListings();
  }, [dispatch, currentPage]);

  const fetchJobListings = async () => {
    dispatch(setLoading(true));
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await Axios.get(
        `admin?page=${currentPage}&perPage=8&title=${query}`,
        { headers }
      );
      const { jobPostings, totalPages } = response.data;
      dispatch(setJobListings(jobPostings));
      console.log(jobPostings);
      dispatch(setTotalPages(totalPages));
      dispatch(setLoading(false));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        showSwalError("Error", "Session expired! Please login", "error").then(
          (result) => {
            if (result.isConfirmed) {
              handleLogoutAndRedirect(navigate);
            }
          }
        );
        console.error("Error: Access denied (403)");
      } else {
        console.error("Error fetching job listings:", error);
      }
      dispatch(setLoading(false));
    }
  };

  // useEffect(() => {
  //   if (searchCleared) {
  //     console.log(searchCleared)
  //     fetchJobListings();
  //     setSearchCleared(false); // Reset the flag after fetching data
  //   }
  // }, [dispatch, currentPage, query]);


  // const handleJobTitleChange = (e) => {
  //   const newQuery = e.target.value;
  //   dispatch(setQuery(newQuery));
  
  //   if (newQuery === '') {
  //     setSearchCleared(true); 
  //     console.log(searchCleared)
  //     dispatch(setCurrentPage(1));
  //   }
  // };

  useEffect(() => {
    if (query === '' && previousQuery !== '') {
      fetchJobListings();
    }
    setPreviousQuery(query);
  }, [dispatch, query, previousQuery]);
  
  const handleJobTitleChange = (e) => {
    const newQuery = e.target.value;
    dispatch(setQuery(newQuery));
  
    if (newQuery === '') {
      dispatch(setCurrentPage(1));
    }
  };

  const handleSearchButtonClick = () => {
      fetchJobListings(); 
      dispatch(setCurrentPage(1)); 
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleResetSearch = () => {
    dispatch(clearQuery())
    dispatch(setCurrentPage(1));
    fetchJobListings();
  };

  const handleViewMoreClick = (job) => {
    dispatch(setSelectedJob(job));
    dispatch(setOpenDialog(true));
  };

  const handleDialogClose = () => {
    dispatch(setOpenDialog(false));
    dispatch(setSelectedJob(null));
  };

  return (
    <Grid className={isMobile ? "mobile-Grid1" : "desktop-Grid1"}>
      <LayoutUser />
      <div className={isMobile ? "mobile-div2" : "desktop-div2"}>
        <Container
          className={isMobile ? "mobile-container1" : "desktop-container1"}
        >
          <div
            className={
              isMobile ? "mobile-searchBarStyle" : "desktop-searchBarStyle"
            }
          >
            <TextField
              label="Search by Job title/company"
              variant="outlined"
              size="small"
              fullWidth
              value={query}
              onChange={handleJobTitleChange}
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
          </div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            //sx={buttonStyle3}
            className={isMobile ? "mobile-button2" : "desktop-button2"}
            onClick={handleResetSearch}
          >
            {" "}
            <Tooltip title="Reset search">
              <RefreshIcon fontSize="small" />
            </Tooltip>
          </Button>
          <div
            className={isMobile ? "mobile-typography1" : "desktop-typography1"}
          >
            <Typography
              fontFamily="Times new Roman"
              fontSize={isMobile ? "20px" : "24px"}
            >
              <strong>Jobs Available</strong>
            </Typography>
          </div>
          <Grid>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
              className={isMobile ? "mobile-pagination" : "desktop-pagination"}
            />
          </Grid>{" "}
          <Grid
            container
            spacing={2}
            justifyContent={isMobile ? "center" : "flex-start"}
          >
            {loading ? (
              <Grid sx={{ marginTop: "40px" }}>
                <Typography variant="h6" color="textSecondary">
                  Loading...
                </Typography>
              </Grid>
            ) : jobListings && jobListings.length > 0 ? (
              jobListings?.map((job, index) => (
                <Grid item key={job._id} md={3}>
                  <Card
                    variant="soft"
                    className={
                      isMobile ? "mobile-cardStyle" : "desktop-cardStyle"
                    }
                  >
                    <CardContent>
                      <Typography
                        style={{
                          fontFamily: "serif",
                          fontSize: "17px",
                          marginTop: "-10px",
                        }}
                      >
                        <strong>{job.jobTitle}</strong>
                      </Typography>
                      <Typography
                        style={{ marginBottom: "10px", fontSize: "15px" }}
                      >
                        {job.admin.companyName}
                      </Typography>
                      <Typography
                        style={{
                          marginBottom: "-5px",
                          fontSize: "14px",
                          display: "grid",
                          gridTemplateColumns: "auto 1fr",
                        }}
                      >
                        <strong
                          style={{ gridColumn: "1", paddingRight: "8px" }}
                        >
                          <LocationOnTwoToneIcon />
                        </strong>
                        <span style={{ gridColumn: "2" }}>
                          {" "}
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
                        <strong
                          style={{ gridColumn: "1", paddingRight: "8px" }}
                        >
                          <CurrencyRupeeTwoToneIcon />
                        </strong>
                        <span style={{ gridColumn: "2" }}>
                          {" "}
                          {job.salaryRange}
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
                        <strong
                          style={{ gridColumn: "1", paddingRight: "8px" }}
                        >
                          <CalendarMonthTwoToneIcon />
                        </strong>
                        <span style={{ gridColumn: "2" }}>
                          {" "}
                          {moment(job.applicationDeadline).format("MMM Do YY")}
                        </span>
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          component={Link}
                          to={`/application/${job._id}`}
                          style={buttonStyle}
                        >
                          Apply
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleViewMoreClick(job)}
                          style={buttonStyle2}
                        >
                          <Tooltip title="View more">
                            <VisibilityIcon fontSize="11px" />
                          </Tooltip>
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ height: "50vh" }}
              >
                <Typography variant="h6" color="textSecondary">
                  No results found.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </div>
      {/* Job Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth={true}
        maxWidth="xs"
      >
        {selectedJob && (
          <>
            <DialogTitle
              sx={{ fontFamily: "Times New Roman", fontSize: "22px" }}
            >
              <strong>{selectedJob.jobTitle}</strong>
              <Button
                onClick={handleDialogClose}
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
              <Typography style={{ marginBottom: "3px", fontSize: "18px" }}>
                <strong>Company:</strong> {selectedJob.admin.companyName}
              </Typography>
              <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
                <strong>Description:</strong> {selectedJob.jobDescription}
              </Typography>
              <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
                <strong>Required Skills:</strong>
                <ul>
                  {selectedJob.requiredSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </Typography>
              <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
                <strong> Salary: </strong>
                {selectedJob.salaryRange}
              </Typography>
              <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
                <strong> Job Type: </strong>
                {selectedJob.jobType}
              </Typography>
              <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
                <strong> Location:</strong> {selectedJob.city},{" "}
                {selectedJob.state}
              </Typography>
              <Typography style={{ marginBottom: "3px", fontSize: "15px" }}>
                <strong>Application Deadline:</strong>{" "}
                {new Date(selectedJob.applicationDeadline).toDateString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                size="small"
                component={Link}
                to={`/application/${selectedJob._id}`}
                style={buttonStyle}
              >
                Apply
              </Button>
              <Button size="small" onClick={handleDialogClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  );
};

export default JobListings;
