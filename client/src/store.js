import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./Reducers/file";
import roleReducer from "./Reducers/Home";
import jobListingsReducer from "./Reducers/jobs";
import authReducer from "./Reducers/authSlice";
import locationReducer from "./Reducers/location";
import loginReducer from "./Reducers/login";

const store = configureStore({
  reducer: {
    role: roleReducer,
    file: fileReducer,
    jobListings: jobListingsReducer,
    auth: authReducer,
    location: locationReducer,
    login: loginReducer,
  },
});

export default store;
