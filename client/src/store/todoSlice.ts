import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task, InsertTask } from "@shared/schema";

interface TodoState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  tasks: JSON.parse(sessionStorage.getItem('tasks') || '[]'),
  loading: false,
  error: null,
};

// Weather API configuration
const WEATHER_API_KEY = "16d4f6d2450759ca1741fcf63413254a";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

let currentId = parseInt(sessionStorage.getItem('currentTaskId') || '1');

export const fetchWeather = createAsyncThunk(
  "todos/fetchWeather",
  async () => {
    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=51.5074&lon=-0.1278&units=metric&appid=${WEATHER_API_KEY}`
    );
    if (!response.ok) throw new Error('Weather API error');
    return response.json();
  }
);

export const addTask = createAsyncThunk(
  "todos/addTask",
  async (task: InsertTask) => {
    const newTask: Task = {
      id: currentId++,
      userId: 1,
      title: task.title,
      completed: false,
      priority: task.priority,
      isOutdoor: task.isOutdoor,
      dueDate: task.dueDate,
      weather: null
    };
    sessionStorage.setItem('currentTaskId', currentId.toString());
    return newTask;
  }
);

export const toggleTask = createAsyncThunk(
  "todos/toggleTask",
  async (taskId: number, { getState }) => {
    const state = getState() as { todos: TodoState };
    const task = state.todos.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');
    return { ...task, completed: !task.completed };
  }
);

export const deleteTask = createAsyncThunk(
  "todos/deleteTask",
  async (taskId: number) => taskId
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
        sessionStorage.setItem('tasks', JSON.stringify(state.tasks));
      })
      .addCase(toggleTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
          sessionStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        sessionStorage.setItem('tasks', JSON.stringify(state.tasks));
      });
  },
});

export default todoSlice.reducer;