import { createSlice } from "@reduxjs/toolkit";

const jobListingsSlice = createSlice({
  name: "jobListings",
  initialState: {
    jobListings: [],
    loading: false,
    query: "",
    currentPage: 1,
    totalPages: 1,
    error: null,
    openDialog: false,
    selectedJob: null,
    previousQuery: "",
  },
  reducers: {
    setJobListings(state, action) {
      state.jobListings = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setQuery(state, action) {
      state.query = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearJobListings(state) {
      state.jobListings = [];
    },
    setOpenDialog(state, action) {
      state.openDialog = action.payload;
    },
    setSelectedJob(state, action) {
      state.selectedJob = action.payload;
    },
    setPreviousQuery(state, action) {
      state.previousQuery = action.payload;
    },
    clearQuery(state) {
      state.query = "";
    },
  },
});

export const {
  setJobListings,
  setLoading,
  setQuery,
  setCurrentPage,
  setTotalPages,
  setError,
  clearJobListings,
  setOpenDialog,
  setSelectedJob,
  setPreviousQuery,
  clearQuery
} = jobListingsSlice.actions;

export default jobListingsSlice.reducer;
