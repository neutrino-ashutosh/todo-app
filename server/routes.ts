import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import OpenWeatherMap from "openweathermap-ts";

// Initialize OpenWeatherMap with proper configuration
const weatherAPI = new OpenWeatherMap({
  apiKey: process.env.VITE_OPENWEATHER_API_KEY || "",
  units: "metric"
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.get("/api/tasks", async (req, res) => {
    const tasks = await storage.getTasks(1); 
    res.json(tasks);
  });

  app.get("/api/weather", async (req, res) => {
    try {
      // Use the correct method from the OpenWeatherMap API
      const weather = await weatherAPI.getCurrentWeatherByGeoCoordinates(
        51.5074, // London coordinates for demo
        -0.1278
      );

      res.json({
        condition: weather.weather[0].main,
        temp: weather.main.temp,
        humidity: weather.main.humidity,
        windSpeed: weather.wind.speed
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