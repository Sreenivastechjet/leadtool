import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addTodo = createAsyncThunk("todo/addTodo", async ({userId,todoData}) => {
  try {
    const response = await axios.post(`/api/v1/auth/${userId}/addtodo`, todoData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const getAllTodos = createAsyncThunk("todo/getAllTodos", async (userId) => {
  try {
    const response = await axios.post(`/api/v1/auth/${userId}/getalltodo`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const updateTodo = createAsyncThunk(
  "todo/updateTodo",
  async ({ userId, todoId, todoData }) => {
    try {
      const response = await axios.put(
        `/api/v1/auth/${userId}/update/${todoId}`,
        todoData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteTodo = createAsyncThunk("todo/deleteTodo", async ({userId, todoId}) => {
  try {
    const response = await axios.delete(`/api/v1/auth/${userId}/delete/${todoId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    loading: false,
    todos: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTodo = action.payload;
        const index = state.todos.findIndex(
          (todo) => todo.id === updatedTodo.id
        );
        if (index !== -1) {
          state.todos[index] = updatedTodo;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(getAllTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        const deletedTodoId = action.payload;
        state.todos = state.todos.filter((todo) => todo.id !== deletedTodoId);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default todoSlice.reducer;
