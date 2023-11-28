// import { createSlice, configureStore } from "@reduxjs/toolkit";

// const initialState = {
//   role: ''
// };

// const roleSlice = createSlice({
//   name: "role",
//   initialState,
//   reducers: {
//     setRole(state, action) {
//       state.role = action.payload.role;
//     }
//   },
// });

// const store = configureStore({
//   reducer: roleSlice.reducer
// });

// export const roleActions = roleSlice.actions;

// export default store;

import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    role: "",
  },
  reducers: {
    setRole(state, action) {
      state.role = action.payload.role;
    },
  },
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;
