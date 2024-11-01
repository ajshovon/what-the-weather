"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WeatherCard } from "@/components/WeatherCard";
import { SearchLocation } from "@/components/SearchLocation";
import { Cloud, CloudRain, Sun, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import sun from "@/components/lottie/clear-day.json";
import haze from "@/components/lottie/haze.json";
import rain from "@/components/lottie/rain.json";
import cloudy from "@/components/lottie/partly-cloudy-day.json";
import Lottie from "react-lottie";

interface WeatherData {
  list: Array<{
    dt_txt: string;
    main: {
      temp: number;
      humidity: number;
      feels_like: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
  city: {
    name: string;
    country: string;
  };
}

const lottieOptions = (animation: any) => ({
  loop: true,
  autoplay: true,
  animationData: animation,
  isClickToPauseDisabled: true,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
});

const sunOptions = lottieOptions(sun);
const rainOptions = lottieOptions(rain);
const hazeOptions = lottieOptions(haze);
const cloudyOptions = lottieOptions(cloudy);

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getBackgroundClass = (weather: WeatherData | null) => {
    if (!weather) return "bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900 dark:via-blue-950 dark:to-gray-950";
    const description = weather.list[0].weather[0].description.toLowerCase();

    if (description.includes("rain")) {
      return "bg-gradient-to-b from-gray-500 via-gray-700 to-gray-900 dark:from-gray-700 dark:via-gray-800 dark:to-gray-950";
    } else if (description.includes("cloud")) {
      return "bg-gradient-to-b from-blue-300 via-gray-400 to-gray-600 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900";
    } else if (description.includes("snow")) {
      return "bg-gradient-to-b from-blue-100 via-gray-200 to-white dark:from-gray-700 dark:via-gray-800 dark:to-gray-900";
    } else if (description.includes("thunder")) {
      return "bg-gradient-to-b from-purple-700 via-gray-800 to-black dark:from-purple-900 dark:via-gray-900 dark:to-black";
    } else if (description.includes("fog")) {
      return "bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900";
    }
    return "bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 dark:from-blue-800 dark:via-blue-900 dark:to-gray-950";
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/weather/${lat}/${lon}`);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  return (
    <main className={`min-h-screen transition-colors duration-1000 ${getBackgroundClass(weather)}`}>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        <AnimatePresence>
          {!weather && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
              <div className="flex space-x-6">
                {[sunOptions, rainOptions, hazeOptions, cloudyOptions].map((opt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.2 }}
                  >
                    <Lottie options={opt} height={80} width={80} />
                  </motion.div>
                ))}
              </div>

              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 dark:text-blue-200 transition-transform hover:scale-110">
                  What The Weather
                </h1>
                <p className="text-lg text-blue-800 dark:text-blue-200">Your destination for precise weather forecasts worldwide</p>
              </div>

              <div className="w-full max-w-xl">
                <SearchLocation onLocationSelect={fetchWeatherData} onError={handleError} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-lg text-blue-900 dark:text-blue-100 animate-pulse">Fetching the latest weather data...</p>
          </motion.div>
        )}

        {weather && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 transition-transform hover:scale-105">
                Weather in {weather.city.name}, {weather.city.country}
              </h2>
              <div className="w-full md:w-auto">
                <SearchLocation onLocationSelect={fetchWeatherData} onError={handleError} />
              </div>
            </div>

            <WeatherCard
              isHighlight
              date={weather.list[0].dt_txt}
              temperature={weather.list[0].main.temp}
              windSpeed={weather.list[0].wind.speed}
              humidity={weather.list[0].main.humidity}
              description={weather.list[0].weather[0].description}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weather.list.slice(1, 7).map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <WeatherCard
                    date={item.dt_txt}
                    temperature={item.main.temp}
                    windSpeed={item.wind.speed}
                    humidity={item.main.humidity}
                    description={item.weather[0].description}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
