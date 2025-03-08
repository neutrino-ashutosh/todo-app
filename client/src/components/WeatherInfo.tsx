import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { Loader2, Cloud, Sun, CloudRain, Wind, Droplets } from "lucide-react";

interface WeatherInfoProps {
  task: Task;
}

interface WeatherData {
  weather: Array<{ main: string }>;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
}

const WEATHER_API_KEY = "16d4f6d2450759ca1741fcf63413254a";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

export default function WeatherInfo({ task }: WeatherInfoProps) {
  const { data: weather, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["weather", task.city],
    queryFn: async () => {
      if (!task.city) throw new Error('No city specified');
      const response = await fetch(
        `${WEATHER_BASE_URL}/weather?q=${encodeURIComponent(task.city)}&units=metric&appid=${WEATHER_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch weather');
      return response.json();
    },
    enabled: Boolean(task.isOutdoor && task.city),
  });

  if (!task.isOutdoor || !task.city) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading weather for {task.city}...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="text-sm text-red-500">
        Could not load weather data for {task.city}
      </div>
    );
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case "Rain":
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      default:
        return <Cloud className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="rounded-lg bg-slate-50 p-3 space-y-2">
      <div className="flex items-center gap-2">
        {getWeatherIcon(weather.weather[0].main)}
        <span className="text-lg font-semibold">{Math.round(weather.main.temp)}°C</span>
        <span className="text-sm text-muted-foreground">{weather.weather[0].main} in {task.city}</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Wind className="h-4 w-4" />
          <span>{weather.wind.speed} m/s</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets className="h-4 w-4" />
          <span>{weather.main.humidity}%</span>
        </div>
      </div>
    </div>
  );
}