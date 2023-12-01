import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./TokenSlice";
import userReducer from "./UserSlice";
import todoReducer from "./TodoSlice";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    user: userReducer,
    todo: todoReducer,
  },
});
