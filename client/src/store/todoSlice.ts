import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task, InsertTask } from "@shared/schema";

interface TodoState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  currentView: 'all' | 'today' | 'important' | 'planned' | 'assigned';
}

const initialState: TodoState = {
  tasks: JSON.parse(sessionStorage.getItem('tasks') || '[]'),
  loading: false,
  error: null,
  currentView: 'today'
};

let currentId = parseInt(sessionStorage.getItem('currentTaskId') || '1');

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
      city: task.city,
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
  reducers: {
    setView: (state, action: PayloadAction<TodoState['currentView']>) => {
      state.currentView = action.payload;
    }
  },
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

export const { setView } = todoSlice.actions;
export default todoSlice.reducer;