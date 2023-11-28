import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  Chip,
  Input,
} from "@mui/material";
import moment from "moment";
import Axios from "axios";
import {
  validationLettersOnly,
  validationLettersWithPeriodAndComma,
  validationLettersWithSpecialChars,
  validationNumbersWithHyphenAndComma,
  validationApplicationDeadline,
} from "../util/validation";

const EditJobDialog = ({
  open,
  onClose,
  editJob,
  setEditJob,
  stateOptions,
  setStateCode,
  cityOptions,
  retrieveJobsByAdminId,
  fetchedSkills,
}) => {
  const [employerError, setEmployerError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [salaryError, setSalaryError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");

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

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setEditJob({
      ...editJob,
      [name]: value,
    });
    if (name === "jobTitle") {
      validateLettersWithPeriodAndComma("Job Title", value, setTitleError);
    }
    if (name === "employerName") {
      validateLettersOnly("Employer Name", value, setEmployerError);
    }
    if (name === "jobDescription") {
      validateLettersWithSpecialChars(
        "Job Description",
        value,
        setDescriptionError
      );
    }
    if (name === "applicationDeadline") {
      validatedeadline("Application Deadline", value, setDeadlineError);
    }
    if (name === "salaryRange") {
      validateNumberswithHyphenAndComma("Salary Range", value, setSalaryError);
    }
    if (name === "state") {
      const selectedState = stateOptions.find((state) => state.name === value);
      if (selectedState) {
        setStateCode(selectedState.iso2);
      }
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = editJob.requiredSkills.filter(
      (skill) => skill !== skillToDelete
    );
    setEditJob({ ...editJob, requiredSkills: updatedSkills });
  };

  const handleEditConfirm = async (e) => {
    e.preventDefault();

    setEmployerError("");
    setTitleError("");
    setDescriptionError("");
    setSalaryError("");
    setDeadlineError("");

    validateLettersWithSpecialChars(
      "Job Description",
      editJob.jobDescription,
      setDescriptionError
    );

    validateLettersOnly(
      "Employer Name",
      editJob.employerName,
      setEmployerError
    );

    validateLettersWithPeriodAndComma(
      "Job Title",
      editJob.jobTitle,
      setTitleError
    );

    validateNumberswithHyphenAndComma(
      "Salary Range",
      editJob.salaryRange,
      setSalaryError
    );

    validatedeadline(
      "Application Deadline",
      editJob.applicationDeadline,
      setDeadlineError
    );
    if (
      descriptionError ||
      employerError ||
      titleError ||
      salaryError ||
      deadlineError
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await Axios.put(`admin/${editJob._id}`, editJob, {
        headers,
      });

      if (response.status === 200) {
        retrieveJobsByAdminId();
      } else {
        console.error("Error updating job with status:", response.status);
      }
    } catch (error) {
      console.error("Error updating job:", error);
    } finally {
      onClose();
      setEditJob(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      maxWidth="sm"
      PaperProps={{
        style: {
          height: "100vh",
        },
      }}
    >
      <form onSubmit={handleEditConfirm}>
        <DialogTitle
          sx={{
            fontFamily: "Times New Roman",
            fontSize: "17px",
            marginTop: "-10px",
          }}
        >
          <strong>EDIT JOB</strong>
          <Button
            onClick={onClose}
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
        <br />
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Job Title"
                fullWidth
                name="jobTitle"
                value={editJob ? editJob.jobTitle : ""}
                onChange={handleChangeEdit}
                error={!!titleError}
                helperText={titleError || " "}
                required
                sx={{ marginTop: "-15px", marginBottom: "-15px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Employer Name"
                fullWidth
                name="employerName"
                value={editJob ? editJob.employerName : ""}
                onChange={handleChangeEdit}
                error={!!employerError}
                helperText={employerError || " "}
                required
                sx={{ marginTop: "-15px", marginBottom: "-15px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required sx={{ marginBottom: "8px" }}>
                <InputLabel htmlFor="State">State</InputLabel>
                <Select
                  label="State"
                  fullWidth
                  name="state"
                  value={editJob ? editJob.state : ""}
                  onChange={handleChangeEdit}
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
              <FormControl fullWidth required sx={{ marginBottom: "8px" }}>
                <InputLabel htmlFor="City">City</InputLabel>
                <Select
                  label="City"
                  fullWidth
                  name="city"
                  value={editJob ? editJob.city : ""}
                  onChange={handleChangeEdit}
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
                rows={3}
                name="jobDescription"
                value={editJob ? editJob.jobDescription : ""}
                onChange={handleChangeEdit}
                error={!!descriptionError}
                helperText={descriptionError || " "}
                required
                sx={{ marginBottom: "-15px" }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required sx={{ marginBottom: "8px" }}>
                <InputLabel>Required Skills</InputLabel>
                <Select
                  multiple
                  name="requiredSkills"
                  value={editJob ? editJob.requiredSkills : []}
                  onChange={handleChangeEdit}
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
                        checked={
                          (editJob && editJob.requiredSkills.includes(skill)) ||
                          false
                        }
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
                value={editJob ? editJob.salaryRange : ""}
                onChange={handleChangeEdit}
                error={!!salaryError}
                helperText={salaryError || " "}
                required
                sx={{ marginBottom: "-15px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Application Deadline"
                fullWidth
                type="date"
                name="applicationDeadline"
                value={
                  editJob
                    ? moment(editJob.applicationDeadline).format("YYYY-MM-DD")
                    : ""
                }
                onChange={handleChangeEdit}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!deadlineError}
                helperText={deadlineError || " "}
                required
                sx={{ marginBottom: "-15px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="Job Type">Job Type</InputLabel>
                <Select
                  label="Job Type"
                  name="jobType"
                  value={editJob ? editJob.jobType : ""}
                  onChange={handleChangeEdit}
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Freelance">Freelance</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="warning" size="small">
            Cancel
          </Button>
          <Button type="submit" color="primary" size="small">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditJobDialog;
