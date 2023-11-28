import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleLogoutAndRedirect } from "../Components/logout";
import {
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  Button,
  TextField,
  Stack,
  Container,
  Chip,
  Input,
  MenuItem,
  InputLabel,
  Select,
  Checkbox,
  FormControl,
} from "@mui/material";
import {
  validationPhoneNumber,
  validationLettersOnly,
  validationLettersAndNumbers,
  validationLettersWithPeriod,
  validationLettersWithPeriodAndComma,
  validationLettersWithSpecialChars,
  validationDateOfBirth,
  showSwalError,
} from "../util/validation";
import {
  fetchSkills,
  fetchSchoolFields,
  fetchCollegeFields,
  fetchCollegeDegree,
  fetchStates,
} from "../util/dropdown";
import LayoutUser from "./LayoutUser";

const ProfileView = () => {
  const navigate = useNavigate();

  const [profileInfo, setProfileInfo] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editedInfo, setEditedInfo] = useState({
    name: "",
    dateOfBirth: "",
    location: "",
    phoneNumber: "",
    about: "",
    schoolinstitution: "",
    schoolfieldOfStudy: "",
    schoolpercentage: "",
    collegeinstitution: "",
    collegedegree: "",
    collegefieldOfStudy: "",
    collegepercentage: "",
    skills: "",
    title: "",
    company: "",
    description: "",
    projectname: "",
    projectdescription: "",
    certificationcertificateId: "",
    certificationname: "",
    certificationdescription: "",
  });

  const [nameError, setNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [dobError, setDobError] = useState("");
  const [aboutError, setAboutError] = useState("");
  const [schoolNameError, setSchoolNameError] = useState("");
  const [collegeNameError, setCollegeNameError] = useState("");
  const [experienceTitleError, setExperienceTitleError] = useState("");
  const [experienceCompanyError, setExperienceCompanyError] = useState("");
  const [experienceDescriptionError, setExperienceDescriptionError] =
    useState("");
  const [projectNameError, setProjectNameError] = useState("");
  const [projectDescriptionError, setProjectDescriptionError] = useState("");
  const [certificationIdError, setCertificationIdError] = useState("");
  const [certificationNameError, setCertificationNameError] = useState("");
  const [certificationDescriptionError, setCertificationDescriptionError] =
    useState("");
  const [stateOptions, setStateOptions] = useState([]);
  const [predefinedSkills, setPredefinedSkills] = useState([]);
  const [predefinedDegree, setPredefinedDegree] = useState([]);
  const [predefinedField, setPredefinedField] = useState([]);
  const [predefinedCfield, setPredefinedCfield] = useState([]);
  const fetchedSkills = predefinedSkills.flat();

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    fetchSkills(setPredefinedSkills);
    fetchSchoolFields(setPredefinedField);
    fetchCollegeFields(setPredefinedCfield);
    fetchCollegeDegree(setPredefinedDegree);
    fetchStates(setStateOptions);
    fetchProfileInfo();
  }, []);

  const validatePhoneNumber = (field, value, setError) => {
    if (!validationPhoneNumber(value)) {
      setError(`Invalid ${field}. Please enter a 10-digit number.`);
    } else {
      setError("");
    }
  };

  const validateDateOfBirth = (field, value) => {
    if (!validationDateOfBirth(value)) {
      setDobError(
        `Invalid ${field}. Future date and below 18 years are not allowed.`
      );
    } else {
      setDobError("");
    }
  };

  const validateLettersOnly = (field, value, setError) => {
    if (!validationLettersOnly(value)) {
      setError(`Invalid ${field}. Please use letters only.`);
    } else {
      setError("");
    }
  };

  const validateLettersAndNumbers = (field, value, setError) => {
    if (!validationLettersAndNumbers(value)) {
      setError(
        `Invalid ${field}. Please use letters, numbers, and spaces only.`
      );
    } else {
      setError("");
    }
  };

  const validateLettersWithPeriod = (field, value, setError) => {
    if (!validationLettersWithPeriod(value)) {
      setError(`Invalid ${field}. Please use letters and periods only.`);
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

  const validateLettersWithSpecialChars = (field, value, setError) => {
    if (!validationLettersWithSpecialChars(value)) {
      setError(
        `Invalid ${field}. Please use letters, spaces, periods, commas, and special characters only.`
      );
    } else {
      setError("");
    }
  };

  const fetchProfileInfo = async () => {
    try {
      const objectId = JSON.parse(localStorage.getItem("object_id"));

      if (!objectId) {
        console.error("User object_id not found in localStorage");
        return;
      }

      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`/profile/${objectId}`, { headers });
      const data = response.data;
      console.log(data);

      setProfileInfo(data.profileInfo);
      setEditedInfo({
        name: data.profileInfo.name,
        dateOfBirth: data.profileInfo.dateOfBirth,
        location: data.profileInfo.personalInfo.location,
        phoneNumber: data.profileInfo.personalInfo.phoneNumber,
        about: data.profileInfo.personalInfo.about,
        schoolinstitution: data.profileInfo.education.school[0].institution,
        schoolfieldOfStudy: data.profileInfo.education.school[0].fieldOfStudy,
        schoolpercentage: data.profileInfo.education.school[0].percentage,
        collegeinstitution: data.profileInfo.education.college[0].institution,
        collegedegree: data.profileInfo.education.college[0].degree,
        collegefieldOfStudy: data.profileInfo.education.college[0].fieldOfStudy,
        collegepercentage: data.profileInfo.education.college[0].percentage,
        skills: data.profileInfo.skills,
        title: data.profileInfo.experience.title,
        company: data.profileInfo.experience.company,
        description: data.profileInfo.experience.description,
        projectname: data.profileInfo.projects[0].name,
        projectdescription: data.profileInfo.projects[0].description,
        certificationcertificateId:
          data.profileInfo.certifications[0].certificateId,
        certificationname: data.profileInfo.certifications[0].name,
        certificationdescription:
          data.profileInfo.certifications[0].description,
      });
      console.log(data.profileInfo);
      setDataFetched(true);
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
        console.error("Error fetching profile info:", error);
      }
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // If leaving edit mode, perform a page reload to discard changes
      window.location.reload();
    } else {
      setIsEditing(true);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    validateLettersOnly("Name", editedInfo.name, setNameError);

    validatePhoneNumber(
      "Phone Number",
      editedInfo.phoneNumber,
      setPhoneNumberError
    );

    validateDateOfBirth("Date of Birth", editedInfo.dateOfBirth, setDobError);

    validateLettersWithSpecialChars("About", editedInfo.about, setAboutError);

    validateLettersWithPeriodAndComma(
      "School Name",
      editedInfo.schoolinstitution,
      setSchoolNameError
    );

    validateLettersWithPeriodAndComma(
      "College Name",
      editedInfo.collegeinstitution,
      setCollegeNameError
    );

    validateLettersWithPeriod(
      "Experience Title",
      editedInfo.title,
      setExperienceTitleError
    );
    validateLettersWithPeriodAndComma(
      "Experience Company",
      editedInfo.company,
      setExperienceCompanyError
    );
    validateLettersWithSpecialChars(
      "Experience description",
      editedInfo.description,
      setExperienceDescriptionError
    );
    validateLettersWithPeriodAndComma(
      "Project Name",
      editedInfo.projectname,
      setProjectNameError
    );
    validateLettersWithSpecialChars(
      "Project Description",
      editedInfo.projectdescription,
      setProjectDescriptionError
    );
    validateLettersAndNumbers(
      "Certification ID",
      editedInfo.certificationcertificateId,
      setCertificationIdError
    );
    validateLettersWithPeriodAndComma(
      "Certification Name",
      editedInfo.certificationname,
      setCertificationNameError
    );

    validateLettersWithSpecialChars(
      "Certificate Description",
      editedInfo.certificationdescription,
      setCertificationDescriptionError
    );

    if (
      nameError ||
      phoneNumberError ||
      dobError ||
      aboutError ||
      schoolNameError ||
      collegeNameError ||
      experienceTitleError ||
      experienceCompanyError ||
      experienceDescriptionError ||
      projectNameError ||
      projectDescriptionError ||
      certificationIdError ||
      certificationNameError ||
      certificationDescriptionError
    ) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const objectId = JSON.parse(localStorage.getItem("object_id"));

      const updatedProfileData = {
        name: editedInfo.name,
        dateOfBirth: editedInfo.dateOfBirth,
        personalInfo: {
          location: editedInfo.location,
          phoneNumber: editedInfo.phoneNumber,
          about: editedInfo.about,
          profilePhoto: profileInfo.personalInfo.profilePhoto,
        },
        education: {
          school: profileInfo.education.school.map((school) => ({
            institution: editedInfo.schoolinstitution,
            fieldOfStudy: editedInfo.schoolfieldOfStudy,
            percentage: editedInfo.schoolpercentage,
          })),
          college: profileInfo.education.college.map((college) => ({
            institution: editedInfo.collegeinstitution,
            degree: editedInfo.collegedegree,
            fieldOfStudy: editedInfo.collegefieldOfStudy,
            percentage: editedInfo.collegepercentage,
          })),
        },
        skills: editedInfo.skills,
        experience: {
          title: editedInfo.title,
          company: editedInfo.company,
          description: editedInfo.description,
        },
        projects: profileInfo.projects.map((project) => ({
          name: editedInfo.projectname,
          description: editedInfo.projectdescription,
        })),
        certifications: profileInfo.certifications.map((certification) => ({
          certificateId: editedInfo.certificationcertificateId,
          name: editedInfo.certificationname,
          description: editedInfo.certificationdescription,
        })),
      };

      await axios.put(`/profile/${objectId}`, updatedProfileData, { headers });

      setIsEditing(false);
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
        console.error("Error saving profile:", error);
      }
    }
  };

  const goBack = () => {
    navigate("/profile");
  };

  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = editedInfo.skills.filter(
      (skill) => skill !== skillToDelete
    );
    setEditedInfo({ ...editedInfo, skills: updatedSkills });
  };

  const handleChange = (field, value) => {
    if (field === "name") {
      validateLettersOnly("Name", value, setNameError);
    }
    if (field === "dateOfBirth") {
      validateDateOfBirth("Date of Birth", value, setDobError);
    }
    if (field === "phoneNumber") {
      validatePhoneNumber("Phone Number", value, setPhoneNumberError);
    }
    if (field === "about") {
      validateLettersWithSpecialChars("About", value, setAboutError);
    }
    if (field === "schoolinstitution") {
      validateLettersWithSpecialChars("School Name", value, setSchoolNameError);
    }
    if (field === "collegeinstitution") {
      validateLettersWithSpecialChars(
        "College Name",
        value,
        setCollegeNameError
      );
    }
    if (field === "title") {
      validateLettersWithSpecialChars(
        "Experience Title",
        value,
        setExperienceTitleError
      );
    }
    if (field === "company") {
      validateLettersWithSpecialChars(
        "Experience Company",
        value,
        setExperienceCompanyError
      );
    }
    if (field === "description") {
      validateLettersWithSpecialChars(
        "Experience description",
        value,
        setExperienceDescriptionError
      );
    }
    if (field === "description") {
      validateLettersWithSpecialChars(
        "Experience description",
        value,
        setExperienceDescriptionError
      );
    }
    if (field === "projectdescription") {
      validateLettersWithSpecialChars(
        "Project Description",
        value,
        setProjectDescriptionError
      );
    }
    if (field === "certificationcertificateId") {
      validateLettersAndNumbers(
        "Certification ID",
        value,
        setCertificationIdError
      );
    }
    if (field === "certificationname") {
      validateLettersWithSpecialChars(
        "Certification Name",
        value,
        setCertificationNameError
      );
    }
    if (field === "certificationdescription") {
      validateLettersWithSpecialChars(
        "Certificate Description",
        value,
        setCertificationDescriptionError
      );
    }
    setEditedInfo({
      ...editedInfo,
      [field]: value,
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#B0C4DE",
        minHeight: "100vh",
      }}
    >
      <LayoutUser />
      <div style={{ paddingBottom: "20px" }}>
        {dataFetched === true && (
          <Container style={{ width: "750px" }}>
            <Paper elevation={10} style={{ padding: "22px" }}>
              <Typography
                sx={{ fontFamily: "Times New Roman", fontSize: "20px" }}
              >
                <strong>MY PROFILE</strong>
              </Typography>
              <form onSubmit={saveProfile}>
                <Typography
                  sx={{ fontFamily: "Times New Roman", fontSize: "19px" }}
                >
                  <strong>Personal Info</strong>
                </Typography>
                <Grid item xs={12} md={6}>
                  <List>
                    <Grid item xs={6}>
                      <ListItem>
                        <TextField
                          label="Name"
                          variant="outlined"
                          fullWidth
                          value={editedInfo.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          error={!!nameError}
                          helperText={nameError || ""}
                          sx={{
                            marginBottom: "2px",
                          }}
                          required
                          InputProps={{
                            readOnly: !isEditing,
                          }}
                        />
                      </ListItem>
                    </Grid>
                    <ListItem>
                      <TextField
                        label="Date of Birth"
                        variant="outlined"
                        type="date"
                        fullWidth
                        value={moment(editedInfo.dateOfBirth).format(
                          "YYYY-MM-DD"
                        )}
                        InputProps={{
                          readOnly: !isEditing,
                        }}
                        onChange={(e) =>
                          handleChange("dateOfBirth", e.target.value)
                        }
                        error={!!dobError}
                        helperText={dobError || " "}
                        required
                        sx={{ marginBottom: "-19px" }}
                      />
                    </ListItem>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <ListItem>
                          <TextField
                            label="Phone Number"
                            variant="outlined"
                            fullWidth
                            value={editedInfo.phoneNumber}
                            InputProps={{
                              readOnly: !isEditing,
                            }}
                            onChange={(e) =>
                              handleChange("phoneNumber", e.target.value)
                            }
                            error={!!phoneNumberError}
                            helperText={phoneNumberError || " "}
                            required
                            sx={{ marginBottom: "-20px" }}
                          />
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          {isEditing ? (
                            <FormControl
                              fullWidth
                              required
                              sx={{ marginBottom: "-10px" }}
                            >
                              <InputLabel>Location</InputLabel>
                              <Select
                                label="Location"
                                value={editedInfo.location}
                                onChange={(e) =>
                                  handleChange("location", e.target.value)
                                }
                              >
                                {stateOptions.map((location, index) => (
                                  <MenuItem
                                    key={index.id}
                                    value={location.name}
                                  >
                                    {location.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              label="Location"
                              variant="outlined"
                              fullWidth
                              value={editedInfo.location}
                              InputProps={{ readOnly: true }}
                            />
                          )}
                        </ListItem>
                      </Grid>
                    </Grid>
                    <ListItem>
                      <TextField
                        label="About"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={2}
                        value={editedInfo.about}
                        InputProps={{
                          readOnly: !isEditing,
                        }}
                        onChange={(e) => handleChange("about", e.target.value)}
                        error={!!aboutError}
                        sx={{ marginBottom: "-25px" }}
                        helperText={aboutError || " "}
                      />
                    </ListItem>
                  </List>
                  <Typography
                    sx={{
                      fontFamily: "Times New Roman",
                      marginBottom: "-10px",
                      fontSize: "19px",
                    }}
                  >
                    <strong>Education</strong>
                  </Typography>
                  <List>
                    {profileInfo.education.school.map((school, index) => (
                      <div key={index}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "Times New Roman",
                            fontSize: "16px",
                          }}
                        >
                          School Detials
                        </Typography>
                        <Grid item xs={6}>
                          <ListItem>
                            <TextField
                              label="School"
                              variant="outlined"
                              fullWidth
                              value={editedInfo.schoolinstitution}
                              InputProps={{
                                readOnly: !isEditing,
                              }}
                              onChange={(e) =>
                                handleChange(
                                  "schoolinstitution",
                                  e.target.value
                                )
                              }
                              error={!!schoolNameError}
                              helperText={schoolNameError || " "}
                              required
                              sx={{ marginBottom: "-20px" }}
                            />
                          </ListItem>
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <ListItem>
                              {isEditing ? (
                                <FormControl fullWidth required>
                                  <InputLabel>Field of Study</InputLabel>
                                  <Select
                                    label="Field of Study"
                                    value={editedInfo.schoolfieldOfStudy}
                                    onChange={(e) =>
                                      handleChange(
                                        "schoolfieldOfStudy",
                                        e.target.value
                                      )
                                    }
                                  >
                                    {predefinedField.map((field, index) => (
                                      <MenuItem key={index} value={field}>
                                        {field}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              ) : (
                                <TextField
                                  label="Field of Study"
                                  variant="outlined"
                                  fullWidth
                                  value={editedInfo.schoolfieldOfStudy}
                                  InputProps={{ readOnly: true }}
                                />
                              )}
                            </ListItem>
                          </Grid>
                          <Grid item xs={6}>
                            <ListItem>
                              {isEditing ? (
                                <TextField
                                  label="Percentage"
                                  variant="outlined"
                                  fullWidth
                                  type="number"
                                  value={editedInfo.schoolpercentage}
                                  required
                                  onChange={(e) =>
                                    handleChange(
                                      "schoolpercentage",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    inputProps: {
                                      min: 0,
                                      max: 100,
                                    },
                                  }}
                                />
                              ) : (
                                <TextField
                                  label="Percentage"
                                  variant="outlined"
                                  fullWidth
                                  type="number"
                                  value={editedInfo.schoolpercentage}
                                  InputProps={{ readOnly: true }}
                                />
                              )}
                            </ListItem>
                          </Grid>
                        </Grid>
                      </div>
                    ))}
                    {profileInfo.education.college.map((college, index) => (
                      <div key={index}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "Times New Roman",
                            fontSize: "16px",
                          }}
                        >
                          College Detials
                        </Typography>
                        <ListItem>
                          <TextField
                            label="College"
                            variant="outlined"
                            fullWidth
                            value={editedInfo.collegeinstitution}
                            InputProps={{
                              readOnly: !isEditing,
                            }}
                            onChange={(e) =>
                              handleChange("collegeinstitution", e.target.value)
                            }
                            error={!!collegeNameError}
                            helperText={collegeNameError || " "}
                            required
                            sx={{ marginBottom: "-20px" }}
                          />
                        </ListItem>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <ListItem>
                              {isEditing ? (
                                <FormControl
                                  fullWidth
                                  required
                                  sx={{ marginBottom: "1px" }}
                                >
                                  <InputLabel>Degree</InputLabel>
                                  <Select
                                    label="Degree"
                                    value={editedInfo.collegedegree}
                                    onChange={(e) =>
                                      handleChange(
                                        "collegedegree",
                                        e.target.value
                                      )
                                    }
                                  >
                                    {predefinedDegree.map((degree, index) => (
                                      <MenuItem key={index} value={degree}>
                                        {degree}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              ) : (
                                <TextField
                                  label="Degree"
                                  variant="outlined"
                                  fullWidth
                                  value={editedInfo.collegedegree}
                                  InputProps={{ readOnly: true }}
                                />
                              )}
                            </ListItem>
                          </Grid>
                          <Grid item xs={6}>
                            <ListItem>
                              {isEditing ? (
                                <FormControl
                                  fullWidth
                                  required
                                  sx={{ marginBottom: "-5px" }}
                                >
                                  <InputLabel>Field of Study</InputLabel>
                                  <Select
                                    label="Field of Study"
                                    value={editedInfo.collegefieldOfStudy}
                                    onChange={(e) =>
                                      handleChange(
                                        "collegefieldOfStudy",
                                        e.target.value
                                      )
                                    }
                                    required
                                  >
                                    {predefinedCfield.map((field, index) => (
                                      <MenuItem key={index} value={field}>
                                        {field}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              ) : (
                                <TextField
                                  label="Field of Study"
                                  variant="outlined"
                                  fullWidth
                                  value={editedInfo.collegefieldOfStudy}
                                  InputProps={{ readOnly: true }}
                                />
                              )}
                            </ListItem>
                          </Grid>
                        </Grid>
                        <ListItem>
                          {isEditing ? (
                            <TextField
                              label="Percentage"
                              variant="outlined"
                              fullWidth
                              type="number"
                              value={editedInfo.collegepercentage}
                              required
                              sx={{ marginBottom: "-10px" }}
                              onChange={(e) =>
                                handleChange(
                                  "collegepercentage",
                                  e.target.value
                                )
                              }
                              InputProps={{
                                inputProps: {
                                  min: 0,
                                  max: 100,
                                },
                              }}
                            />
                          ) : (
                            <TextField
                              label="Percentage"
                              variant="outlined"
                              fullWidth
                              type="number"
                              value={editedInfo.collegepercentage}
                              InputProps={{ readOnly: true }}
                            />
                          )}
                        </ListItem>
                      </div>
                    ))}
                  </List>

                  <Typography
                    sx={{ fontFamily: "Times New Roman", fontSize: "19px" }}
                  >
                    <strong>Skills</strong>
                  </Typography>
                  <Grid item xs={6}>
                    <ListItem>
                      {isEditing ? (
                        <FormControl fullWidth required>
                          <InputLabel>Skills</InputLabel>
                          <Select
                            multiple
                            name="skills"
                            value={editedInfo.skills}
                            onChange={(e) =>
                              handleChange("skills", e.target.value)
                            }
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
                                  checked={editedInfo.skills.includes(skill)}
                                />
                                {skill}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          label="Skills"
                          variant="outlined"
                          fullWidth
                          value={editedInfo.skills.join(", ")}
                          InputProps={{ readOnly: true }}
                        />
                      )}
                    </ListItem>
                  </Grid>

                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Times New Roman",
                      fontSize: "19px",
                      marginBottom: "-10px",
                    }}
                  >
                    <strong>Experience</strong>
                  </Typography>
                  <List>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <ListItem>
                          <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={editedInfo.title}
                            InputProps={{
                              readOnly: !isEditing,
                            }}
                            onChange={(e) =>
                              handleChange("title", e.target.value)
                            }
                            error={!!experienceTitleError}
                            helperText={experienceTitleError || " "}
                            sx={{ marginBottom: "-20px" }}
                          />
                        </ListItem>
                      </Grid>
                      <Grid item xs={6}>
                        <ListItem>
                          <TextField
                            label="Company"
                            variant="outlined"
                            fullWidth
                            value={editedInfo.company}
                            InputProps={{
                              readOnly: !isEditing,
                            }}
                            onChange={(e) =>
                              handleChange("company", e.target.value)
                            }
                            error={!!experienceCompanyError}
                            helperText={experienceCompanyError || " "}
                            sx={{ marginBottom: "-20px" }}
                          />
                        </ListItem>
                      </Grid>
                    </Grid>
                    <ListItem>
                      <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={2}
                        value={editedInfo.description}
                        InputProps={{
                          readOnly: !isEditing,
                        }}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        error={!!experienceDescriptionError}
                        helperText={experienceDescriptionError || " "}
                        sx={{ marginBottom: "-30px" }}
                      />
                    </ListItem>
                  </List>

                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Times New Roman",
                      fontSize: "19px",
                      marginBottom: "-8px",
                    }}
                  >
                    <strong>Projects</strong>
                  </Typography>
                  <List>
                    {profileInfo.projects.map((project, index) => (
                      <div key={index}>
                        <ListItem>
                          <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={editedInfo.projectname}
                            InputProps={{
                              readOnly: !isEditing,
                            }}
                            onChange={(e) =>
                              handleChange("projectname", e.target.value)
                            }
                            error={!!projectNameError}
                            helperText={projectNameError || " "}
                            required
                            sx={{ marginBottom: "-20px" }}
                          />
                        </ListItem>
                        <ListItem>
                          <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={editedInfo.projectdescription}
                            InputProps={{
                              readOnly: !isEditing,
                            }}
                            onChange={(e) =>
                              handleChange("projectdescription", e.target.value)
                            }
                            error={!!projectDescriptionError}
                            helperText={projectDescriptionError || " "}
                            required
                            sx={{ marginBottom: "-30px" }}
                          />
                        </ListItem>
                      </div>
                    ))}
                  </List>

                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Times New Roman",
                      fontSize: "19px",
                      marginBottom: "-8px",
                    }}
                  >
                    <strong>Certifications</strong>
                  </Typography>
                  <List>
                    {profileInfo.certifications.map((certification, index) => (
                      <div key={index}>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <ListItem>
                              <TextField
                                label="Certificate ID"
                                variant="outlined"
                                fullWidth
                                value={editedInfo.certificationcertificateId}
                                InputProps={{
                                  readOnly: !isEditing,
                                }}
                                onChange={(e) =>
                                  handleChange(
                                    "certificationcertificateId",
                                    e.target.value
                                  )
                                }
                                error={!!certificationIdError}
                                helperText={certificationIdError || " "}
                                sx={{ marginBottom: "-20px" }}
                              />
                            </ListItem>
                          </Grid>
                          <Grid item xs={6}>
                            <ListItem>
                              <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                value={editedInfo.certificationname}
                                InputProps={{
                                  readOnly: !isEditing,
                                }}
                                onChange={(e) =>
                                  handleChange(
                                    "certificationname",
                                    e.target.value
                                  )
                                }
                                error={!!certificationNameError}
                                helperText={certificationNameError || " "}
                                sx={{ marginBottom: "-20px" }}
                              />
                            </ListItem>
                          </Grid>
                        </Grid>
                        <ListItem>
                          <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={editedInfo.certificationdescription}
                            InputProps={{
                              readOnly: !isEditing,
                            }}
                            onChange={(e) =>
                              handleChange(
                                "certificationdescription",
                                e.target.value
                              )
                            }
                            error={!!certificationDescriptionError}
                            helperText={certificationDescriptionError || " "}
                          />
                        </ListItem>
                      </div>
                    ))}
                  </List>

                  <Stack
                    direction={isEditing ? "row" : "row"}
                    justifyContent={isEditing ? "flex-end" : "flex-end"}
                    alignItems="flex-end"
                    spacing={2}
                  >
                    {isEditing ? (
                      <>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          style={{ marginRight: 8 }}
                          size="small"
                          sx={{ fontSize: "12px" }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={toggleEdit}
                          style={{ marginRight: 8 }}
                          size="small"
                          sx={{ fontSize: "12px" }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={toggleEdit}
                        style={{ marginRight: 8 }}
                        size="small"
                        sx={{ fontSize: "12px" }}
                      >
                        Edit
                      </Button>
                    )}
                    {isEditing ? null : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={goBack}
                        size="small"
                        sx={{ fontSize: "12px" }}
                      >
                        Back
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </form>
            </Paper>
          </Container>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
