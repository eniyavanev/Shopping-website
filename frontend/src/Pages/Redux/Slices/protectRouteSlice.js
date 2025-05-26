import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null,
  error: null,
};

const protectRouteSlice = createSlice({
  name: "protectRoute",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
      state.loading = false;
      state.error = null;
    },
    removeUser: (state, action) => {
      state.user =null;
      localStorage.removeItem("userData");
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, removeUser } = protectRouteSlice.actions;
export default protectRouteSlice.reducer;
