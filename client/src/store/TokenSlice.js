import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const refreshToken = createAsyncThunk("token/refreshToken", async () => {
  if (localStorage.getItem("loginToken")) {
    const response = await axios.get("/api/v1/auth/refreshToken");
    return response.data.accessToken;
  }
});

const refreshTokenSlice = createSlice({
  name: "token",
  initialState: {
    loading: false,
    accessToken: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.accessToken = null;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.accessToken = null;
        state.error = action.error.message || "Invalid Auth..Login Again..";
      });
  },
});

export default refreshTokenSlice.reducer;
