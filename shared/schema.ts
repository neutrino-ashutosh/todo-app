import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  priority: text("priority").notNull().default("medium"),
  isOutdoor: boolean("is_outdoor").notNull().default(false),
  dueDate: timestamp("due_date"),
  weather: jsonb("weather"),
  city: text("city"), // Added city field
  important: boolean("important").notNull().default(false) // Added important field
});

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  isOutdoor: z.boolean().default(false),
  dueDate: z.date().nullable(),
  city: z.string().optional(),
  important: z.boolean().default(false)
});

export interface Task {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  priority: string;
  isOutdoor: boolean;
  dueDate: Date | null;
  city?: string;
  weather: any | null;
  important: boolean;
}

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;