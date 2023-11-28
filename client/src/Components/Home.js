// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Stack, Button, Typography, Grid } from "@mui/material";
// import "../css/Home.css";

// const Home = () => {
//   const navigate = useNavigate();

//   function navigateHandler(role) {
//     console.log(role);
//     navigate("/login", { state: { role } });
//   }

//   return (
//     <div className="home-page">
//       <header>
//         <h2> WELCOME TO JOB PORTAL </h2>
//       </header>
//       <Grid sx={{ marginTop: "25px" }}>
//         <marquee direction="left" behavior="scroll" scrollamount="10">
//           <Typography variant="body2">
//             Job seekers, click the "User" button to get more updates. Job
//             providers, click the "Admin" button to post jobs.
//           </Typography>
//         </marquee>
//       </Grid>
//       <Stack spacing={5} direction={"row"} justifyContent={"center"}>
//         <Button
//           variant="contained"
//           size="small"
//           style={{
//             fontFamily: "Times New Roman",
//             height: "30px",
//             width: "24px",
//           }}
//           onClick={() => navigateHandler("User")}
//         >
//           <strong>User</strong>
//         </Button>
//         <Button
//           variant="contained"
//           size="small"
//           style={{
//             fontFamily: "Times New Roman",
//             height: "30px",
//             width: "24px",
//           }}
//           onClick={() => navigateHandler("Admin")}
//         >
//           <strong>Admin</strong>
//         </Button>
//       </Stack>
//     </div>
//   );
// };

// export default Home;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Button, Typography, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import  {setRole} from "../Reducers/Home"; // Assuming store.js is in the same directory
import "../css/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function navigateHandler(role) {
    dispatch(setRole({ role })); // Dispatching the role to the store
    navigate("/login", { state: { role } });
  }

  // const toggleCounter = () => {
  //   dispatch(roleActions.toggleCounter()); 
  // };

  return (
    <div className="home-page">
      <header>
        <h2> WELCOME TO JOB PORTAL </h2>
      </header>
      <Grid sx={{ marginTop: "25px" }}>
        <marquee direction="left" behavior="scroll" scrollamount="10">
          <Typography variant="body2">
            Job seekers, click the "User" button to get more updates. Job
            providers, click the "Admin" button to post jobs.
          </Typography>
        </marquee>
      </Grid>
      <Stack spacing={5} direction={"row"} justifyContent={"center"}>
        <Button
          variant="contained"
          size="small"
          style={{
            fontFamily: "Times New Roman",
            height: "30px",
            width: "24px",
          }}
          onClick={() => {
            navigateHandler("User");
          }}
        >
          <strong>User</strong>
        </Button>
        <Button
          variant="contained"
          size="small"
          style={{
            fontFamily: "Times New Roman",
            height: "30px",
            width: "24px",
          }}
          onClick={() => {
            navigateHandler("Admin");
          }}
        >
          <strong>Admin</strong>
        </Button>
      </Stack>
    </div>
  );
};

export default Home;

