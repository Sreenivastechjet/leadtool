import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getuserInfo = createAsyncThunk("user/userInfo", async (token) => {
  try {
    const response = await axios.get(`/api/v1/auth/userinfo`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    userInfo: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getuserInfo.pending, (state) => {
        state.loading = true;
        state.userInfo = null;
        state.error = null;
      })
      .addCase(getuserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(getuserInfo.rejected, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
