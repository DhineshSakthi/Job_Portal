import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Container,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Checkbox,
  MenuItem,
  Chip,
  Input,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import {
  validationPhoneNumber,
  validationLettersOnly,
  validationLettersAndNumbers,
  validationLettersWithPeriod,
  validationLettersWithPeriodAndComma,
  validationLettersWithSpecialChars,
  validationDateOfBirth,
} from "../util/validation";
import {
  fetchSkills,
  fetchSchoolFields,
  fetchCollegeFields,
  fetchCollegeDegree,
  fetchStates,
} from "../util/dropdown";

const Profile = () => {
  const navigate = useNavigate();

  const [profileInfo, setProfileInfo] = useState({
    name: "",
    dateOfBirth: "",
    personalInfo: {
      phoneNumber: "",
      location: "",
      about: "",
      profilePhoto: "",
    },
    education: {
      school: [
        {
          institution: "",
          fieldOfStudy: "",
          percentage: "",
        },
      ],
      college: [
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          percentage: "",
        },
      ],
    },
    skills: [],
    experience: {
      title: "",
      company: "",
      description: "",
    },
    projects: [
      {
        name: "",
        description: "",
      },
    ],
    certifications: [
      {
        certificateId: "",
        name: "",
        description: "",
      },
    ],
    user: {
      object_id: JSON.parse(localStorage.getItem("object_id")),
    },
  });

  const [stateOptions, setStateOptions] = useState([]);
  const [predefinedSkills, setPredefinedSkills] = useState([]);
  const [predefinedDegree, setPredefinedDegree] = useState([]);
  const [predefinedField, setPredefinedField] = useState([]);
  const [predefinedCfield, setPredefinedCfield] = useState([]);
  const fetchedSkills = predefinedSkills.flat();
  const [nameError, setNameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
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

  useEffect(() => {
    fetchSkills(setPredefinedSkills);
    fetchSchoolFields(setPredefinedField);
    fetchCollegeFields(setPredefinedCfield);
    fetchCollegeDegree(setPredefinedDegree);
    fetchStates(setStateOptions);
  }, []);

  const validatePhoneNumber = (field, value) => {
    if (!validationPhoneNumber(value)) {
      setPhoneNumberError(`Invalid ${field}. Please enter a 10-digit number.`);
    } else {
      setPhoneNumberError("");
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

  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = profileInfo.skills.filter(
      (skill) => skill !== skillToDelete
    );
    setProfileInfo({ ...profileInfo, skills: updatedSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateLettersOnly("Name", profileInfo.name, setNameError);

    validateDateOfBirth("Date of Birth", profileInfo.dateOfBirth, setDobError);
    validatePhoneNumber(
      "Phone Number",
      profileInfo.personalInfo.phoneNumber,
      setPhoneNumberError
    );

    validateLettersWithSpecialChars(
      "About",
      profileInfo.personalInfo.about,
      setAboutError
    );

    profileInfo.education.school.forEach((school, schoolIndex) => {
      validateLettersWithPeriodAndComma(
        "School Name",
        school.institution,
        (nameError) => {
          setSchoolNameError(nameError);
        }
      );
    });

    profileInfo.education.college.forEach((college, collegeIndex) => {
      validateLettersWithPeriodAndComma(
        "College Name",
        college.institution,
        (nameError) => {
          setCollegeNameError(nameError);
        }
      );
    });

    validateLettersWithPeriod(
      "Experience Title",
      profileInfo.experience.title,
      setExperienceTitleError
    );
    validateLettersWithPeriodAndComma(
      "Experience Company",
      profileInfo.experience.company,
      setExperienceCompanyError
    );
    validateLettersWithSpecialChars(
      "Experience description",
      profileInfo.experience.description,
      setExperienceDescriptionError
    );

    profileInfo.projects.forEach((project, index) => {
      validateLettersWithPeriodAndComma(
        "Project Name",
        project.name,
        (error) => {
          setProjectNameError(error);
        }
      );
      validateLettersWithSpecialChars(
        "Project Description",
        project.description,
        (error) => {
          setProjectDescriptionError(error);
        }
      );
    });

    profileInfo.certifications.forEach((certification, index) => {
      validateLettersAndNumbers(
        "Certification ID",
        certification.certificateId,
        (error) => {
          setCertificationIdError(error);
        }
      );
      validateLettersWithPeriodAndComma(
        "Certification Name",
        certification.name,
        (error) => {
          setCertificationNameError(error);
        }
      );

      validateLettersWithSpecialChars(
        "Certificate Description",
        certification.description,
        (error) => {
          setCertificationDescriptionError(error);
        }
      );
    });

    if (
      !nameError &&
      !dobError &&
      !phoneNumberError &&
      !aboutError &&
      !schoolNameError &&
      !collegeNameError &&
      !experienceTitleError &&
      !experienceCompanyError &&
      !experienceDescriptionError &&
      !projectNameError &&
      !projectDescriptionError &&
      !certificationIdError &&
      !certificationNameError &&
      !certificationDescriptionError
    ) {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await Axios.post("/profile", profileInfo, { headers });
        console.log("Profile data sent successfully:", response.data);
        navigate("/profile");
      } catch (error) {
        console.error("Error sending profile data:", error);
      }
    }
  };

  return (
    <div style={{ backgroundColor: "#B0C4DE" }}>
      <br />
      <Container maxWidth="md">
        <Paper style={{ padding: "22px" }} elevation={10}>
          <Typography
            sx={{
              fontFamily: "Times New Roman",
              marginBottom: "15px",
              fontSize: "20px",
            }}
          >
            <strong>CREATE PROFILE</strong>
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Times New Roman",
                fontSize: "19px",
                marginTop: "-10px",
                marginBottom: "15px",
              }}
            >
              <strong>Personal Info</strong>
            </Typography>
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={profileInfo.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setProfileInfo({ ...profileInfo, name: newName });
                    validateLettersOnly("Name", newName, setNameError);
                  }}
                  sx={{ marginBottom: "-10px" }}
                  required
                  error={!!nameError}
                  helperText={nameError || " "}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Date of Birth"
                  fullWidth
                  type="date"
                  name="dateOfBirth"
                  value={
                    profileInfo.dateOfBirth
                      ? moment(profileInfo.dateOfBirth).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setProfileInfo({ ...profileInfo, [name]: value });

                    if (name === "dateOfBirth") {
                      validateDateOfBirth("Date of Birth", value, setDobError);
                    }
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ marginBottom: "-10px" }}
                  required
                  onBlur={validateDateOfBirth}
                  error={!!dobError}
                  helperText={dobError || " "}
                />
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={profileInfo.personalInfo.phoneNumber}
                  onChange={(e) => {
                    const newPhoneNumber = e.target.value;
                    setProfileInfo({
                      ...profileInfo,
                      personalInfo: {
                        ...profileInfo.personalInfo,
                        phoneNumber: newPhoneNumber,
                      },
                    });
                    validatePhoneNumber(
                      "Phone Number",
                      newPhoneNumber,
                      setPhoneNumberError
                    );
                  }}
                  sx={{ marginBottom: "-10px" }}
                  required
                  error={!!phoneNumberError}
                  helperText={phoneNumberError || " "}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Location</InputLabel>
                  <Select
                    label="Location"
                    value={profileInfo.personalInfo.location}
                    onChange={(e) =>
                      setProfileInfo({
                        ...profileInfo,
                        personalInfo: {
                          ...profileInfo.personalInfo,
                          location: e.target.value,
                        },
                      })
                    }
                    sx={{ marginBottom: "-10px" }}
                  >
                    {stateOptions.map((location, index) => (
                      <MenuItem key={index.id} value={location.name}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              label="About"
              fullWidth
              multiline
              rows={2}
              value={profileInfo.personalInfo.about}
              onChange={(e) => {
                const newAbout = e.target.value;
                setProfileInfo({
                  ...profileInfo,
                  personalInfo: {
                    ...profileInfo.personalInfo,
                    about: newAbout,
                  },
                });
                validateLettersWithSpecialChars(
                  "About",
                  newAbout,
                  setAboutError
                );
              }}
              sx={{ marginBottom: "-10px" }}
              error={!!aboutError}
              helperText={aboutError || " "}
            />
            <Typography
              sx={{ fontFamily: "Times New Roman", fontSize: "19px" }}
            >
              <strong>Education</strong>
            </Typography>
            {profileInfo.education.school.map((school, schoolIndex) => (
              <div key={schoolIndex}>
                <Typography
                  sx={{ fontFamily: "Times New Roman", fontSize: "16px" }}
                >
                  School Detials
                </Typography>
                <TextField
                  label="School Name"
                  fullWidth
                  value={profileInfo.education.school[schoolIndex].institution}
                  onChange={(e) => {
                    const newInstitution = e.target.value;
                    setProfileInfo({
                      ...profileInfo,
                      education: {
                        ...profileInfo.education,
                        school: profileInfo.education.school.map((item, i) =>
                          i === schoolIndex
                            ? { ...item, institution: newInstitution }
                            : item
                        ),
                      },
                    });
                    validateLettersWithPeriodAndComma(
                      "School Name",
                      newInstitution,
                      (error) => {
                        setSchoolNameError(error);
                      }
                    );
                  }}
                  sx={{ marginBottom: "-10px" }}
                  required
                  error={!!schoolNameError}
                  helperText={schoolNameError || " "}
                />

                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ marginBottom: 1 }}>
                      <InputLabel>Field of Study</InputLabel>
                      <Select
                        label="Field of Study"
                        value={
                          profileInfo.education.school[schoolIndex]
                            .fieldOfStudy || ""
                        }
                        onChange={(e) => {
                          const newFieldOfStudy = e.target.value;
                          setProfileInfo((prevProfileInfo) => ({
                            ...prevProfileInfo,
                            education: {
                              ...prevProfileInfo.education,
                              school: prevProfileInfo.education.school.map(
                                (item, i) =>
                                  i === schoolIndex
                                    ? { ...item, fieldOfStudy: newFieldOfStudy }
                                    : item
                              ),
                            },
                          }));
                        }}
                      >
                        {predefinedField.map((field, index) => (
                          <MenuItem key={index} value={field}>
                            {field}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Percentage"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={
                        profileInfo.education.school[schoolIndex].percentage
                      }
                      required
                      onChange={(e) => {
                        const newPercentage = e.target.value;
                        setProfileInfo({
                          ...profileInfo,
                          education: {
                            ...profileInfo.education,
                            school: profileInfo.education.school.map(
                              (item, i) =>
                                i === schoolIndex
                                  ? { ...item, percentage: newPercentage }
                                  : item
                            ),
                          },
                        });
                      }}
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            ))}

            {profileInfo.education.college.map((college, collegeIndex) => (
              <div key={collegeIndex}>
                <Typography
                  sx={{ fontFamily: "Times New Roman", fontSize: "16px" }}
                >
                  College Detials
                </Typography>
                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <TextField
                      label="College Name"
                      fullWidth
                      value={
                        profileInfo.education.college[collegeIndex].institution
                      }
                      onChange={(e) => {
                        const newInstitution = e.target.value;
                        setProfileInfo({
                          ...profileInfo,
                          education: {
                            ...profileInfo.education,
                            college: profileInfo.education.college.map(
                              (item, i) =>
                                i === collegeIndex
                                  ? { ...item, institution: newInstitution }
                                  : item
                            ),
                          },
                        });
                        validateLettersWithPeriodAndComma(
                          "College Name",
                          newInstitution,
                          (error) => {
                            setCollegeNameError(error);
                          }
                        );
                      }}
                      sx={{ marginBottom: "-10px" }}
                      required
                      error={!!collegeNameError}
                      helperText={collegeNameError || " "}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      required
                      sx={{ marginBottom: "-10px" }}
                    >
                      <InputLabel>Degree</InputLabel>
                      <Select
                        label="Degree"
                        value={
                          profileInfo.education.college[collegeIndex].degree ||
                          ""
                        }
                        onChange={(e) => {
                          const newDegree = e.target.value;
                          setProfileInfo((prevProfileInfo) => ({
                            ...prevProfileInfo,
                            education: {
                              ...prevProfileInfo.education,
                              college: prevProfileInfo.education.college.map(
                                (item, i) =>
                                  i === collegeIndex
                                    ? { ...item, degree: newDegree }
                                    : item
                              ),
                            },
                          }));
                        }}
                        required
                      >
                        {predefinedDegree.map((field, degree) => (
                          <MenuItem key={degree} value={field}>
                            {field}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      required
                      sx={{ marginBottom: "4px" }}
                    >
                      <InputLabel>Field of Study</InputLabel>
                      <Select
                        label="Field of Study"
                        value={
                          profileInfo.education.college[collegeIndex]
                            .fieldOfStudy || ""
                        }
                        onChange={(e) => {
                          const newFieldOfStudy = e.target.value;
                          setProfileInfo((prevProfileInfo) => ({
                            ...prevProfileInfo,
                            education: {
                              ...prevProfileInfo.education,
                              college: prevProfileInfo.education.college.map(
                                (item, i) =>
                                  i === collegeIndex
                                    ? { ...item, fieldOfStudy: newFieldOfStudy }
                                    : item
                              ),
                            },
                          }));
                        }}
                      >
                        {predefinedCfield.map((field, fieldIndex) => (
                          <MenuItem key={fieldIndex} value={field}>
                            {field}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Percentage"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={
                        profileInfo.education.college[collegeIndex].percentage
                      }
                      required
                      onChange={(e) => {
                        const newPercentage = e.target.value;
                        setProfileInfo({
                          ...profileInfo,
                          education: {
                            ...profileInfo.education,
                            college: profileInfo.education.college.map(
                              (item, i) =>
                                i === collegeIndex
                                  ? { ...item, percentage: newPercentage }
                                  : item
                            ),
                          },
                        });
                      }}
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                      sx={{ marginBottom: "4px" }}
                    />
                  </Grid>
                </Grid>
              </div>
            ))}

            <Typography
              sx={{ fontFamily: "Times New Roman", fontSize: "19px" }}
            >
              <strong>Skills</strong>
            </Typography>
            <FormControl fullWidth required sx={{ marginBottom: "4px" }}>
              <InputLabel>Skills</InputLabel>
              <Select
                multiple
                name="skills"
                value={profileInfo.skills}
                onChange={(e) =>
                  setProfileInfo({ ...profileInfo, skills: e.target.value })
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
                    <Checkbox checked={profileInfo.skills.includes(skill)} />
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography
              sx={{
                fontFamily: "Times New Roman",
                marginBottom: 1,
                fontSize: "19px",
              }}
            >
              <strong>Experience</strong>
            </Typography>
            <Grid container spacing={6}>
              <Grid item xs={6}>
                <TextField
                  label="Title"
                  fullWidth
                  value={profileInfo.experience.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setProfileInfo({
                      ...profileInfo,
                      experience: {
                        ...profileInfo.experience,
                        title: newTitle,
                      },
                    });
                    validateLettersWithPeriod(
                      "Experience Title",
                      newTitle,
                      setExperienceTitleError
                    );
                  }}
                  sx={{ marginBottom: "-10px" }}
                  error={!!experienceTitleError}
                  helperText={experienceTitleError || " "}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Company"
                  fullWidth
                  value={profileInfo.experience.company}
                  onChange={(e) => {
                    const newCompany = e.target.value;
                    setProfileInfo({
                      ...profileInfo,
                      experience: {
                        ...profileInfo.experience,
                        company: newCompany,
                      },
                    });
                    validateLettersWithPeriodAndComma(
                      "Experience Company",
                      newCompany,
                      setExperienceCompanyError
                    );
                  }}
                  sx={{ marginBottom: "-10px" }}
                  error={!!experienceCompanyError}
                  helperText={experienceCompanyError || " "}
                />
              </Grid>
            </Grid>

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={profileInfo.experience.description}
              onChange={(e) => {
                const newDescription = e.target.value;
                setProfileInfo({
                  ...profileInfo,
                  experience: {
                    ...profileInfo.experience,
                    description: newDescription,
                  },
                });
                validateLettersWithSpecialChars(
                  "Experience Description",
                  newDescription,
                  setExperienceDescriptionError
                );
              }}
              sx={{ marginBottom: "-20px" }}
              error={!!experienceDescriptionError}
              helperText={experienceDescriptionError || " "}
            />
            <Typography
              sx={{
                fontFamily: "Times New Roman",
                fontSize: "19px",
                marginBottom: 1,
              }}
            >
              <strong>Projects</strong>
            </Typography>
            {profileInfo.projects.map((project, index) => (
              <div key={index}>
                <TextField
                  label="Project Name"
                  fullWidth
                  value={project.name}
                  onChange={(e) => {
                    const newProjectName = e.target.value;
                    setProfileInfo({
                      ...profileInfo,
                      projects: profileInfo.projects.map((item, i) =>
                        i === index ? { ...item, name: newProjectName } : item
                      ),
                    });
                    validateLettersWithPeriodAndComma(
                      "Project Name",
                      newProjectName,
                      (error) => {
                        setProjectNameError(error);
                      }
                    );
                  }}
                  sx={{ marginBottom: "-10px" }}
                  error={!!projectNameError}
                  helperText={projectNameError || " "}
                  required
                />
                <TextField
                  label="Project Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={project.description}
                  onChange={(e) => {
                    const newProjectDescription = e.target.value;
                    setProfileInfo({
                      ...profileInfo,
                      projects: profileInfo.projects.map((item, i) =>
                        i === index
                          ? { ...item, description: newProjectDescription }
                          : item
                      ),
                    });
                    validateLettersWithSpecialChars(
                      "Project Description",
                      newProjectDescription,
                      setProjectDescriptionError
                    );
                  }}
                  sx={{ marginBottom: "-15px" }}
                  error={!!projectDescriptionError}
                  helperText={projectDescriptionError || " "}
                  required
                />
              </div>
            ))}

            <Typography
              sx={{
                fontFamily: "Times New Roman",
                marginBottom: 1,
                fontSize: "19px",
              }}
            >
              <strong>Certifications</strong>
            </Typography>
            {profileInfo.certifications.map((certification, index) => (
              <div key={index}>
                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <TextField
                      label="Certificate ID"
                      fullWidth
                      value={certification.certificateId}
                      onChange={(e) => {
                        const newCertificateId = e.target.value;
                        setProfileInfo({
                          ...profileInfo,
                          certifications: profileInfo.certifications.map(
                            (item, i) =>
                              i === index
                                ? { ...item, certificateId: newCertificateId }
                                : item
                          ),
                        });

                        validateLettersAndNumbers(
                          "Certification ID",
                          newCertificateId,
                          (error) => {
                            setCertificationIdError(error);
                          }
                        );
                      }}
                      sx={{ marginBottom: "-10px" }}
                      error={!!certificationIdError}
                      helperText={certificationIdError || " "}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Certification Name"
                      fullWidth
                      value={certification.name}
                      onChange={(e) => {
                        const newCertificationName = e.target.value;
                        setProfileInfo({
                          ...profileInfo,
                          certifications: profileInfo.certifications.map(
                            (item, i) =>
                              i === index
                                ? { ...item, name: newCertificationName }
                                : item
                          ),
                        });
                        validateLettersWithPeriodAndComma(
                          "Certification Name",
                          newCertificationName,
                          (error) => {
                            setCertificationNameError(error);
                          }
                        );
                      }}
                      sx={{ marginBottom: "-10px" }}
                      error={!!certificationNameError}
                      helperText={certificationNameError || " "}
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={certification.description}
                  onChange={(e) => {
                    const newCertificationDescription = e.target.value;
                    setProfileInfo({
                      ...profileInfo,
                      certifications: profileInfo.certifications.map(
                        (item, i) =>
                          i === index
                            ? {
                                ...item,
                                description: newCertificationDescription,
                              }
                            : item
                      ),
                    });
                    validateLettersWithSpecialChars(
                      "Certification Description",
                      newCertificationDescription,
                      setCertificationDescriptionError
                    );
                  }}
                  sx={{ marginBottom: "-10px" }}
                  error={!!certificationDescriptionError}
                  helperText={certificationDescriptionError || " "}
                />
              </div>
            ))}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              sx={{ fontSize: "12px" }}
            >
              Save Profile
            </Button>
          </form>
        </Paper>
      </Container>
      <br />
    </div>
  );
};

export default Profile;
