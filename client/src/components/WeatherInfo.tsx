import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { Loader2, Cloud, Sun, CloudRain, Wind, Droplets } from "lucide-react";

interface WeatherInfoProps {
  task: Task;
}

interface WeatherData {
  condition: string;
  temp: number;
  humidity: number;
  windSpeed: number;
}

export default function WeatherInfo({ task }: WeatherInfoProps) {
  const { data: weather, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["/api/weather"],
    enabled: task.isOutdoor,
  });

  if (!task.isOutdoor) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="text-sm text-red-500">
        Could not load weather data
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
        {getWeatherIcon(weather.condition)}
        <span className="text-lg font-semibold">{Math.round(weather.temp)}°C</span>
        <span className="text-sm text-muted-foreground">{weather.condition}</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Wind className="h-4 w-4" />
          <span>{weather.windSpeed} m/s</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets className="h-4 w-4" />
          <span>{weather.humidity}%</span>
        </div>
      </div>
    </div>
  );
}