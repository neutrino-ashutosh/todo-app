import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";

const OPENWEATHER_API_KEY = "16d4f6d2450759ca1741fcf63413254a";
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.get("/api/tasks", async (req, res) => {
    const tasks = await storage.getTasks(1); 
    res.json(tasks);
  });

  app.get("/api/weather", async (req, res) => {
    try {
      console.log("Fetching weather data...");
      const response = await fetch(
        `${OPENWEATHER_BASE_URL}/weather?lat=51.5074&lon=-0.1278&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`OpenWeather API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Weather data received:", data);

      res.json({
        condition: data.weather[0].main,
        temp: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      });
    } catch (error) {
      console.error('Weather API Error:', error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    const parsed = insertTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const task = await storage.createTask(1, parsed.data);
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id/toggle", async (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = await storage.toggleTask(1, taskId);
    if (!task) return res.sendStatus(404);
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const taskId = parseInt(req.params.id);
    await storage.deleteTask(1, taskId);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}