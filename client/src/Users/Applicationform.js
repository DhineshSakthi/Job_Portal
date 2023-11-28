import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  CircularProgress,
  Chip,
  Checkbox,
  MenuItem,
  Input,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import Axios from "axios";
import LayoutUser from "./LayoutUser";
import {
  validationPhoneNumber,
  validationLettersOnly,
  validationLettersWithSpecialChars,
  showSwalError,
} from "../util/validation";
import {
  fetchSkills,
  fetchCollegeFields,
  fetchCollegeDegree,
  fetchStates,
} from "../util/dropdown";
import { toast } from "react-toastify";
import { handleLogoutAndRedirect } from "../Components/logout";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    schoolPercentage: "",
    collegeDegree: "",
    fieldOfStudy: "",
    collegePercentage: "",
    skills: [],
    projects: "",
    experience: "",
    certifications: "",
    job_id: "",
    user: "",
    resumePath: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [projectNameError, setProjectNameError] = useState("");
  const [experienceDescriptionError, setExperienceDescriptionError] =
    useState("");
  const [certificationNameError, setCertificationNameError] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [predefinedSkills, setPredefinedSkills] = useState([]);
  const [predefinedDegree, setPredefinedDegree] = useState([]);
  const [predefinedCfield, setPredefinedCfield] = useState([]);
  const fetchedSkills = predefinedSkills.flat();
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    fetchSkills(setPredefinedSkills);
    fetchCollegeFields(setPredefinedCfield);
    fetchCollegeDegree(setPredefinedDegree);
    fetchStates(setStateOptions);

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const userId = JSON.parse(localStorage.getItem("object_id"));

    Axios.get(`/application/check/${jobId}/${userId}`)
      .then((response) => {
        if (response.data.applied) {
          setAlreadyApplied(true);
        }
      })
      .catch((error) => {
        console.error("Error checking application status:", error);
      });

    Axios.get(`/profile/${userId}`, {headers})
      .then((response) => {
        console.log(response.data);
        setApplicationData({
          name: response.data.profileInfo.name,
          email: response.data.profileInfo.userdetails.email,
          phoneNumber: response.data.profileInfo.personalInfo.phoneNumber,
          location: response.data.profileInfo.personalInfo.location,
          schoolPercentage:
            response.data.profileInfo.education.school[0].percentage,
          collegeDegree: response.data.profileInfo.education.college[0].degree,
          fieldOfStudy:
            response.data.profileInfo.education.college[0].fieldOfStudy,
          collegePercentage:
            response.data.profileInfo.education.college[0].percentage,
          skills: response.data.profileInfo.skills,
          experience: response.data.profileInfo.experience.description,
          projects: response.data.profileInfo.projects[0].name,
          certifications: response.data.profileInfo.certifications[0].name,
          job_id: {
            object_id: jobId,
          },
          user: {
            object_id: JSON.parse(localStorage.getItem("object_id")),
          },
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response.status);
        if (error.response.status === 403) {
          showSwalError("Error", "Session expired! Please login", "error").then(
            (result) => {
              if (result.isConfirmed) {
                handleLogoutAndRedirect(navigate);
              }
            }
          );
        } else {
          console.error("Error in fetching profile Info:", error);
        }
      });
  }, []);

  const validatePhoneNumber = (field, value, setError) => {
    if (!validationPhoneNumber(value)) {
      setPhoneNumberError(`Invalid ${field}. Please enter a 10-digit number.`);
    } else {
      setPhoneNumberError("");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData({ ...applicationData, [name]: value });

    if (name === "name") {
      validateLettersOnly("Name", value, setNameError);
    }
    if (name === "phoneNumber") {
      validatePhoneNumber("Phone Number", value, setPhoneNumberError);
    }
    if (name === "projects") {
      validateLettersWithSpecialChars("Projects", value, setProjectNameError);
    }
    if (name === "experience") {
      validateLettersWithSpecialChars(
        "Experience",
        value,
        setExperienceDescriptionError
      );
    }
    if (name === "certifications") {
      validateLettersWithSpecialChars(
        "Certifications",
        value,
        setCertificationNameError
      );
    }
  };

  const handleGoToBack = () => {
    navigate("/joblistings");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateLettersOnly("Name", applicationData.name, setNameError);

    validatePhoneNumber(
      "Phone Number",
      applicationData.phoneNumber,
      setPhoneNumberError
    );
    validateLettersWithSpecialChars(
      "Experience",
      applicationData.experience,
      setExperienceDescriptionError
    );
    validateLettersWithSpecialChars(
      "Projects",
      applicationData.projects,
      setProjectNameError
    );
    validateLettersWithSpecialChars(
      "Certifications",
      applicationData.certifications,
      setCertificationNameError
    );

    if (
      !nameError &&
      !phoneNumberError &&
      !experienceDescriptionError &&
      !projectNameError &&
      !certificationNameError &&
      resumeFile
    ) {
      if (alreadyApplied) {
        setSnackbarMessage("You have already applied for this job.");
        setSnackbarOpen(true);
        setIsLoading(false);
      } else {
        if (resumeFile) {
          const formData = new FormData();
          formData.append("resume", resumeFile);
          const userId = JSON.parse(localStorage.getItem("object_id"));
          try {
            const token = localStorage.getItem("token");
            const headers = {
              Authorization: `Bearer ${token}`,
            };
            const resumeResponse = await Axios.post(
              `/application/uploadresume?userId=${userId}&jobId=${jobId}`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );

            if (resumeResponse.status === 201) {
              const applicationDataWithResume = {
                ...applicationData,
                resumePath: resumeResponse.data.path,
              };

              const applicationResponse = await Axios.post(
                "/application",
                applicationDataWithResume,
                { headers }
              );
              console.log(applicationDataWithResume);
              if (applicationResponse.status === 201) {
                setSnackbarMessage("Application submitted successfully");
                setSnackbarOpen(true);
                toast.success("Application submitted successfully", {
                  position: "top-right",
                });
                setTimeout(() => {
                  navigate("/joblistings");
                }, 300);
              } else if (applicationResponse.status === 400) {
                setSnackbarMessage("You have already applied for this job.");
                setSnackbarOpen(true);
              } else {
                setSnackbarMessage("Application submission failed");
                setSnackbarOpen(true);
              }
            } else {
              setSnackbarMessage("Resume upload failed");
              setSnackbarOpen(true);
            }
          } catch (error) {
            console.log(error);
            console.log(error.response.status);
            if (error.response.status === 400) {
              setSnackbarMessage("You have already applied for this job");
              setSnackbarOpen(true);
            } else if (error.response.status === 403) {
              showSwalError(
                "Error",
                "Session expired! Please login",
                "error"
              ).then((result) => {
                if (result.isConfirmed) {
                  handleLogoutAndRedirect(navigate);
                }
              });
            } else {
              console.error("Error submitting application23:", error);
              setSnackbarMessage("Error submitting application12");
              setSnackbarOpen(true);
            }
          } finally {
            setIsLoading(false);
          }
        } else {
          setSnackbarMessage("Please select a resume file");
          setSnackbarOpen(true);
          setIsLoading(false);
        }
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = applicationData.skills.filter(
      (skill) => skill !== skillToRemove
    );
    setApplicationData({ ...applicationData, skills: updatedSkills });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid style={{ backgroundColor: "#B0C4DE", minHeight: "100vh" }}>
      <LayoutUser />
      <div style={{ paddingBottom: "20px" }}>
        <Container
          style={{ width: "800px", marginTop: "1px", marginBottom: "10px" }}
        >
          <Paper elevation={3} style={{ padding: "2rem" }}>
            <Typography
              variant="h5"
              sx={{ fontFamily: "Times New Roman", marginBottom: "15px" }}
            >
              <strong>Application Form</strong>
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    size="small"
                    name="name"
                    value={applicationData.name}
                    onChange={handleInputChange}
                    error={!!nameError}
                    helperText={nameError || ""}
                    sx={{ marginBottom: 1 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    size="small"
                    name="email"
                    type="email"
                    value={applicationData.email}
                    InputProps={{ readOnly: true }}
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    size="small"
                    name="phoneNumber"
                    value={applicationData.phoneNumber}
                    onChange={handleInputChange}
                    error={!!phoneNumberError}
                    helperText={phoneNumberError || " "}
                    required
                    sx={{ marginBottom: -2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required
                    sx={{ marginBottom: -2 }}
                    size="small"
                  >
                    <InputLabel htmlFor="location">Location</InputLabel>
                    <Select
                      label="Location"
                      fullWidth
                      name="location"
                      value={applicationData.location}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="School Percentage"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="number"
                    name="schoolPercentage"
                    value={applicationData.schoolPercentage}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: 100,
                      },
                    }}
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required
                    sx={{ marginBottom: 1 }}
                    size="small"
                  >
                    <InputLabel htmlFor="collegeDegree">
                      College Degree
                    </InputLabel>
                    <Select
                      label="College Degree"
                      fullWidth
                      name="collegeDegree"
                      value={applicationData.collegeDegree}
                      onChange={handleInputChange}
                      required
                    >
                      {predefinedDegree.map((degree, index) => (
                        <MenuItem key={index} value={degree}>
                          {degree}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required
                    sx={{ marginBottom: 1 }}
                    size="small"
                  >
                    <InputLabel htmlFor="fieldOfStudy">
                      Field of Study
                    </InputLabel>
                    <Select
                      label="Field of Study"
                      fullWidth
                      name="fieldOfStudy"
                      value={applicationData.fieldOfStudy}
                      onChange={handleInputChange}
                      required
                    >
                      {predefinedCfield.map((field, index) => (
                        <MenuItem key={index} value={field}>
                          {field}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="College Percentage"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="number"
                    name="collegePercentage"
                    value={applicationData.collegePercentage}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: 100,
                      },
                    }}
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl
                    fullWidth
                    required
                    sx={{ marginBottom: 1 }}
                    size="small"
                  >
                    <InputLabel>Skills</InputLabel>
                    <Select
                      multiple
                      name="skills"
                      value={applicationData.skills}
                      onChange={handleInputChange}
                      input={<Input />}
                      renderValue={(selected) => (
                        <div>
                          {applicationData.skills.map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              style={{ margin: 2 }}
                              onDelete={() => handleRemoveSkill(skill)} // Corrected this line
                            />
                          ))}
                        </div>
                      )}
                    >
                      {fetchedSkills.map((skill) => (
                        <MenuItem key={skill} value={skill}>
                          <Checkbox
                            checked={applicationData.skills.includes(skill)}
                          />
                          {skill}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Projects"
                    fullWidth
                    multiline
                    rows={2}
                    name="projects"
                    value={applicationData.projects}
                    onChange={handleInputChange}
                    error={!!projectNameError}
                    helperText={projectNameError || " "}
                    required
                    sx={{ marginBottom: -2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Experience"
                    fullWidth
                    multiline
                    rows={2}
                    name="experience"
                    value={applicationData.experience}
                    onChange={handleInputChange}
                    error={!!experienceDescriptionError}
                    helperText={experienceDescriptionError || " "}
                    sx={{ marginBottom: -2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Certifications"
                    fullWidth
                    multiline
                    rows={2}
                    name="certifications"
                    value={applicationData.certifications}
                    onChange={handleInputChange}
                    error={!!certificationNameError}
                    helperText={certificationNameError || " "}
                    sx={{ marginBottom: -2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Resume"
                    fullWidth
                    size="small"
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ marginBottom: 3 }}
                    required
                  />
                </Grid>
                <Grid sx={{ marginLeft: "2%" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleGoToBack}
                    sx={{
                      marginLeft: "20px",
                    }}
                  >
                    Go Back
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={5000}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
            />
          </Paper>
        </Container>
      </div>
    </Grid>
  );
};

export default ApplicationForm;
