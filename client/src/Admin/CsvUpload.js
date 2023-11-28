// import React, { useState } from "react";
// import axios from "axios";
// import { showSwalError } from "../util/validation";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
// } from "@mui/material";

// const CsvUploadComponent = ({ open, onClose, onSuccess }) => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];

//     if (!selectedFile) {
//       return;
//     }

//     const fileExtension = selectedFile.name.split(".").pop();

//     if (fileExtension.toLowerCase() !== "csv") {
//       showSwalError("Error", "Please upload a valid CSV file Only.", "error");
//       e.target.value = null;
//     } else {
//       setFile(selectedFile);
//     }
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append("file", file);
//     const adminId = JSON.parse(localStorage.getItem("object_id"));
//     try {
//       const response = await axios.post(
//         `/admin/uploadcsv?adminId=${adminId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 201) {
//         console.log("File uploaded successfully!", response.data);
//         showSwalError(
//           "Success",
//           "File uploaded successfully, data stored in the database.",
//           "success"
//         );
//         setFile(null);
//         onSuccess();
//         console.error("File upload failed.");
//         showSwalError("Error", "File upload failed", "error");
//         setFile(null);
//       }
//       onClose(); // Close the dialog
//     } catch (error) {
//       if (error.response.status === 400) {
//         console.error(error.response.data.error);
//         showSwalError("Error", error.response.data.error, "error");
//         setFile(null);
//       } else {
//         console.error("File upload failed.", error);
//         showSwalError("Error", "File upload failed.", "error");
//         setFile(null);
//       }
//       onClose(); // Close the dialog
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>
//         <strong>Upload Job as CSV File</strong>
//       </DialogTitle>
//       <br />
//       <DialogContent>
//         <TextField
//           type="file"
//           fullWidth
//           label="CSV File"
//           InputLabelProps={{ shrink: true }}
//           inputProps={{
//             accept: ".csv",
//           }}
//           onChange={handleFileChange}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} size="small">
//           Cancel
//         </Button>
//         <Button
//           onClick={handleUpload}
//           variant="contained"
//           color="primary"
//           size="small"
//         >
//           Upload
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default CsvUploadComponent;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { showSwalError } from "../util/validation";
import { useDispatch, useSelector } from "react-redux";
import { setFile, clearFile } from "../Reducers/file"; 

const CsvUploadComponent = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const file = useSelector((state) => state.file.file);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop();

    if (fileExtension.toLowerCase() !== "csv") {
      showSwalError("Error", "Please upload a valid CSV file Only.", "error");
      e.target.value = null;
      dispatch(clearFile()); 
      onClose(); 
      return;
    } else {
      dispatch(setFile(selectedFile)); 
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const adminId = JSON.parse(localStorage.getItem("object_id"));
    
    try {
      const response = await axios.post(
        `/admin/uploadcsv?adminId=${adminId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log("File uploaded successfully!", response.data);
        showSwalError(
          "Success",
          "File uploaded successfully, data stored in the database.",
          "success"
        );
        dispatch(clearFile()); // Dispatch action to clear the file from the Redux store
        onSuccess();
      }

      onClose(); // Close the dialog
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(error.response.data.error);
        showSwalError("Error", error.response.data.error, "error");
      } else {
        console.error("File upload failed.", error);
        showSwalError("Error", "File upload failed.", "error");
      }

      dispatch(clearFile()); // Dispatch action to clear the file even in case of failure
      onClose(); // Close the dialog
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <strong>Upload Job as CSV File</strong>
      </DialogTitle>
      <br />
      <DialogContent>
        <TextField
          type="file"
          fullWidth
          label="CSV File"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            accept: ".csv",
          }}
          onChange={handleFileChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          size="small"
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CsvUploadComponent;

