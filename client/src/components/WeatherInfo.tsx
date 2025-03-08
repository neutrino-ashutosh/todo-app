import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { Loader2, Cloud, Sun, CloudRain } from "lucide-react";

interface WeatherInfoProps {
  task: Task;
}

interface WeatherData {
  condition: string;
  temp: number;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";

export default function WeatherInfo({ task }: WeatherInfoProps) {
  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ["/api/weather"],
    enabled: task.isOutdoor,
  });

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  if (!weather) return null;

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case "Rain":
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      default:
        return <Cloud className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getWeatherIcon(weather.condition)}
      <span className="text-sm">{weather.temp}°C</span>
    </div>
  );
}