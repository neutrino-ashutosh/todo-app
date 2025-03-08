import { InsertUser, User, InsertTask, Task } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getTasks(userId: number): Promise<Task[]>;
  createTask(userId: number, task: InsertTask): Promise<Task>;
  toggleTask(userId: number, taskId: number): Promise<Task | undefined>;
  deleteTask(userId: number, taskId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private currentUserId: number;
  private currentTaskId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.currentUserId = 1;
    this.currentTaskId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId,
    );
  }

  async createTask(userId: number, insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = {
      id,
      userId,
      title: insertTask.title,
      priority: insertTask.priority,
      isOutdoor: insertTask.isOutdoor,
      completed: false,
      weather: null
    };
    this.tasks.set(id, task);
    return task;
  }

  async toggleTask(userId: number, taskId: number): Promise<Task | undefined> {
    const task = this.tasks.get(taskId);
    if (!task || task.userId !== userId) return undefined;

    const updated = { ...task, completed: !task.completed };
    this.tasks.set(taskId, updated);
    return updated;
  }

  async deleteTask(userId: number, taskId: number): Promise<void> {
    const task = this.tasks.get(taskId);
    if (task && task.userId === userId) {
      this.tasks.delete(taskId);
    }
  }
}

export const storage = new MemStorage();