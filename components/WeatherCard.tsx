"use client";

import { Card } from "@/components/ui/card";
import { Thermometer, Wind, Droplets } from "lucide-react";
import { WeatherIcon } from "@/components/WeatherIcon";
import { cn } from "@/lib/utils";

interface WeatherCardProps {
  date: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
  description: string;
  isHighlight?: boolean;
}

export function WeatherCard({
  date,
  temperature,
  windSpeed,
  humidity,
  description,
  isHighlight = false,
}: WeatherCardProps) {
  const getWeatherClass = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes("rain")) {
      return "weather-rain";
    } else if (desc.includes("cloud")) {
      return "weather-cloudy";
    } else if (desc.includes("snow")) {
      return "weather-snow";
    } else if (desc.includes("thunder")) {
      return "weather-storm";
    } else if (desc.includes("fog") || desc.includes("mist")) {
      return "weather-fog";
    }
    return "weather-clear";
  };

  const weatherClass = getWeatherClass(description);

  return (
    <Card
      className={cn(
        "relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg",
        weatherClass,
        isHighlight ? "p-8" : "p-6",
        isHighlight ? "bg-white/90 dark:bg-gray-800/90" : "bg-white/80 dark:bg-gray-800/80"
      )}
    >
      <div className="relative z-10 space-y-4">
        <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          {new Date(date).toLocaleDateString(undefined, {
            weekday: "long",
            hour: "numeric",
          })}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WeatherIcon description={description} size={isHighlight ? 32 : 24} />
            <span className={cn("font-bold", isHighlight ? "text-5xl" : "text-2xl")}>
              {Math.round(temperature)}°C
            </span>
          </div>
        </div>
        <p className="text-lg capitalize">{description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Wind</p>
              <p className="font-semibold">{Math.round(windSpeed)} m/s</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
              <p className="font-semibold">{humidity}%</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}