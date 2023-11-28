import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setConfirmPassword(state, action) {
      state.confirmPassword = action.payload;
    },
  },
});

export const { setUsername, setEmail, setPassword, setConfirmPassword } =
  loginSlice.actions;
export default loginSlice.reducer;
