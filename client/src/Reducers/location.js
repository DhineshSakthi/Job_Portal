import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stateOptions: [],
  cityOptions: [],
  stateCode: '',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setStateOptions(state, action) {
      state.stateOptions = action.payload;
    },
    setCityOptions(state, action) {
      state.cityOptions = action.payload;
    },
    setStateCode(state, action) {
      state.stateCode = action.payload;
    },
  },
});

export const {
  setStateOptions,
  setCityOptions,
  setStateCode,
} = locationSlice.actions;

export default locationSlice.reducer;
