import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  Input,
  Chip,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
} from "@mui/material";
import {
  validationLettersOnly,
  validationLettersWithPeriodAndComma,
  validationLettersWithSpecialChars,
  validationNumbersWithHyphenAndComma,
  validationApplicationDeadline,
} from "../util/validation";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { fetchSkills, fetchStates, fetchCities } from "../util/dropdown";

const JobAdmin = () => {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    employerName: "",
    jobTitle: "",
    state: "",
    city: "",
    jobDescription: "",
    requiredSkills: [],
    applicationDeadline: "",
    salaryRange: "",
    jobType: "",
    admin: {
      object_id: JSON.parse(localStorage.getItem("object_id")),
      companyName: "",
    },
  });

  const [submissionStatus, setSubmissionStatus] = useState("idle");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [employerError, setEmployerError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [salaryError, setSalaryError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [stateCode, setStateCode] = useState("");
  const [predefinedSkills, setPredefinedSkills] = useState([]);
  const fetchedSkills = predefinedSkills.flat();

  useEffect(() => {
    fetchStates(setStateOptions);
  }, []);

  useEffect(() => {
    if (stateCode) {
      fetchCities(stateCode, setCityOptions);
    }
  }, [stateCode]);

  useEffect(() => {
    fetchSkills(setPredefinedSkills);
    // Fetch the company name when the component mounts
    const fetchCompanyName = async () => {
      try {
        const adminId = JSON.parse(localStorage.getItem("object_id"));
        const response = await Axios.get(`/register/${adminId}`);

        if (response.status === 200) {
          setJobData((prevJobData) => ({
            ...prevJobData,
            admin: {
              ...prevJobData.admin,
              companyName: response.data.companyName,
            },
          }));
        } else {
          console.error(
            "Error fetching company name with status:",
            response.status
          );
          // Handle the error as needed
        }
      } catch (error) {
        console.error("Error fetching company name:", error);
        // Handle the error as needed
      }
    };

    fetchCompanyName();
  }, []);

  const validatedeadline = (field, value) => {
    if (!validationApplicationDeadline(value)) {
      setDeadlineError(`Invalid ${field}. Please enter a valid deadline.`);
    } else {
      setDeadlineError("");
    }
  };

  const validateLettersWithSpecialChars = (field, value, setError) => {
    if (!validationLettersWithSpecialChars(value)) {
      setError(
        `Invalid ${field}. Please use letters, spaces, periods, commas, and special characters only.`
      );
    } else {
      setError("");
    }
  };

  const validateLettersOnly = (field, value, setError) => {
    if (!validationLettersOnly(value)) {
      setError(`Invalid ${field}. Please use letters only.`);
    } else {
      setError("");
    }
  };

  const validateLettersWithPeriodAndComma = (field, value, setError) => {
    if (!validationLettersWithPeriodAndComma(value)) {
      setError(
        `Invalid ${field}. Please use letters, spaces, periods, and commas only.`
      );
    } else {
      setError("");
    }
  };

  const validateNumberswithHyphenAndComma = (field, value, setError) => {
    if (!validationNumbersWithHyphenAndComma(value)) {
      setError(`Invalid ${field}. Please use Numbers, Hyphen and commas only.`);
    } else {
      setError("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });

    if (name === "state") {
      // Update the country code when the country is selected
      const selectedState = stateOptions.find((state) => state.name === value);
      if (selectedState) {
        setStateCode(selectedState.iso2);
      }
    }
    if (name === "jobDescription") {
      validateLettersWithSpecialChars(
        "Job Description",
        value,
        setDescriptionError
      );
    }

    if (name === "employerName") {
      validateLettersOnly("Employer Name", value, setEmployerError);
    }
    if (name === "jobTitle") {
      validateLettersWithPeriodAndComma("Job Title", value, setTitleError);
    }

    if (name === "salaryRange") {
      validateNumberswithHyphenAndComma("Salary Range", value, setSalaryError);
    }

    if (name === "applicationDeadline") {
      validatedeadline("Application Deadline", value, setDeadlineError);
    }
  };

  const handleSkillsChange = (e) => {
    setJobData({ ...jobData, requiredSkills: e.target.value });
  };

  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = jobData.requiredSkills.filter(
      (skill) => skill !== skillToDelete
    );
    setJobData({ ...jobData, requiredSkills: updatedSkills });
  };

  const handleGoToHome = () => {
    navigate("/adminprofile");
  };

  const handleGoToViewJobs = () => {
    navigate("/ourjobs");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateLettersWithSpecialChars(
      "Job Description",
      jobData.jobDescription,
      setDescriptionError
    );

    validateLettersOnly(
      "Employer Name",
      jobData.employerName,
      setEmployerError
    );

    validateLettersWithPeriodAndComma(
      "Job Title",
      jobData.jobTitle,
      setTitleError
    );

    validateNumberswithHyphenAndComma(
      "Salary Range",
      jobData.salaryRange,
      setSalaryError
    );

    validatedeadline(
      "Application Deadline",
      jobData.applicationDeadline,
      setDeadlineError
    );
    if (
      !descriptionError &&
      !employerError &&
      !titleError &&
      !salaryError &&
      !deadlineError
    ) {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        // Send the jobData to the server
        const response = await Axios.post(
          "/admin",
          jobData,
          { headers }
        );

        if (response.status === 201) {
          // Job posting successful
          setSubmissionStatus("success");
          setSnackbarMessage("Job posted successfully"); // Set success message
          setSnackbarOpen(true);

          setJobData({
            employerName: "",
            jobTitle: "",
            state: "",
            city: "",
            jobDescription: "",
            requiredSkills: [],
            applicationDeadline: "",
            salaryRange: "",
            jobType: "",
            admin: {
              object_id: JSON.parse(localStorage.getItem("object_id")),
              companyName: jobData.admin.companyName, // Preserve the company name
            },
          });
        } else {
          console.error("Job posting failed with status:", response.status);
          // Handle the error as needed
          setSnackbarMessage("Job posting failed"); // Set error message
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error posting job:", error);
        // Handle the error as needed
        setSnackbarMessage("Error posting job"); // Set error message
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ backgroundColor: "#B0C4DE", minHeight: "100vh", paddingTop: "30px"}}>
      <Container style={{ width: "900px" }}>
        <Paper elevation={3} style={{ padding: "1.5rem" }}>
          <Typography
            variant="h5"
            sx={{ fontFamily: "Times New Roman", marginTop: "-20px" }}
          >
            <strong>Create Job</strong>
          </Typography>
          <br />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  label="Company Name"
                  fullWidth
                  name="companyName"
                  value={jobData.admin.companyName}
                  InputProps={{ readOnly: true }}
                  sx={{ marginBottom: "-15px" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Job Title"
                  fullWidth
                  name="jobTitle"
                  value={jobData.jobTitle}
                  onChange={handleInputChange}
                  error={!!titleError}
                  helperText={titleError || " "}
                  required
                  sx={{ marginBottom: "-15px" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Employer Name"
                  fullWidth
                  name="employerName"
                  value={jobData.employerName}
                  onChange={handleInputChange}
                  error={!!employerError}
                  helperText={employerError || " "}
                  required
                  sx={{ marginBottom: "-15px" }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    label="Job Type"
                    name="jobType"
                    value={jobData.jobType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Freelance">Freelance</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required sx={{ marginBottom: "5px" }}>
                  <InputLabel htmlFor="State">State</InputLabel>
                  <Select
                    label="State"
                    fullWidth
                    name="state"
                    value={jobData.state}
                    onChange={handleInputChange}
                  >
                    {stateOptions.map((location, index) => (
                      <MenuItem key={index} value={location.name}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required sx={{ marginBottom: "5px" }}>
                  <InputLabel htmlFor="City">City</InputLabel>
                  <Select
                    label="City"
                    fullWidth
                    name="city"
                    value={jobData.city}
                    onChange={handleInputChange}
                  >
                    {cityOptions.map((location, index) => (
                      <MenuItem key={index} value={location.name}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  fullWidth
                  multiline
                  rows={2}
                  name="jobDescription"
                  value={jobData.jobDescription}
                  onChange={handleInputChange}
                  error={!!descriptionError}
                  helperText={descriptionError || " "}
                  required
                  sx={{ marginBottom: "-15px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required sx={{ marginBottom: "8px" }}>
                  <InputLabel htmlFor="Required Skills">
                    Required Skills
                  </InputLabel>
                  <Select
                    label="Required Skills"
                    multiple
                    name="requiredSkills"
                    value={jobData.requiredSkills}
                    onChange={handleSkillsChange}
                    input={<Input />}
                    renderValue={(selected) => (
                      <div>
                        {selected.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            style={{ margin: 2 }}
                            onDelete={() => handleDeleteSkill(skill)}
                          />
                        ))}
                      </div>
                    )}
                  >
                    {fetchedSkills.map((skill) => (
                      <MenuItem key={skill} value={skill}>
                        <Checkbox
                          checked={jobData.requiredSkills.includes(skill)}
                        />
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Salary Range"
                  fullWidth
                  name="salaryRange"
                  value={jobData.salaryRange}
                  onChange={handleInputChange}
                  error={!!salaryError}
                  helperText={salaryError || " "}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Application Deadline"
                  fullWidth
                  required
                  type="date"
                  name="applicationDeadline"
                  value={jobData.applicationDeadline}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!deadlineError}
                  helperText={deadlineError || " "}
                />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
              >
                Register
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                size="small"
                onClick={handleGoToViewJobs}
              >
                View Jobs
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                size="small"
                onClick={handleGoToHome}
              >
                Home
              </Button>
            </Stack>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={5000}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
            />
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default JobAdmin;
