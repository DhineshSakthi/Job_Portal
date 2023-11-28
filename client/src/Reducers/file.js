import { createSlice } from "@reduxjs/toolkit";

const fileSlice = createSlice({
  name: "file",
  initialState: {
    file: null,
  },
  reducers: {
    setFile(state, action) {
      state.file = action.payload;
    },
    clearFile(state) {
      state.file = null;
    },
  },
});

export const { setFile, clearFile } = fileSlice.actions;
export default fileSlice.reducer;
