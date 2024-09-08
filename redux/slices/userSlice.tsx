import { createSlice, configureStore } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    authenticated: false,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    },
  },
});

export const { setProfile, setAuthenticated } = userSlice.actions;

export const selectProfile = (state) => state.user.profile;
export const selectAuthenticated = (state) => state.user.authenticated;

export default userSlice.reducer;
