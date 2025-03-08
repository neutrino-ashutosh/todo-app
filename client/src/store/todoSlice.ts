import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task, InsertTask } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface TodoState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk("todos/fetchTasks", async () => {
  const response = await fetch("/api/tasks", { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
});

export const addTask = createAsyncThunk(
  "todos/addTask",
  async (task: InsertTask) => {
    const response = await apiRequest("POST", "/api/tasks", task);
    return response.json();
  }
);

export const toggleTask = createAsyncThunk(
  "todos/toggleTask",
  async (taskId: number) => {
    const response = await apiRequest("PATCH", `/api/tasks/${taskId}/toggle`);
    return response.json();
  }
);

export const deleteTask = createAsyncThunk(
  "todos/deleteTask",
  async (taskId: number) => {
    await apiRequest("DELETE", `/api/tasks/${taskId}`);
    return taskId;
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(toggleTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
