"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

interface LocationSuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

interface SearchLocationProps {
  onLocationSelect: (lat: number, lon: number) => void;
  onError: (message: string) => void;
}

export function SearchLocation({ onLocationSelect, onError }: SearchLocationProps) {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions from the API
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false); // Close dropdown if input is empty
      return;
    }

    setLoading(true);
    setOpen(true); // Ensure dropdown opens on first search
    try {
      const response = await fetch(`/api/location/${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      onError("Failed to search location");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with delay
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocation(newValue);

    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        fetchSuggestions(newValue);
      }, 1000)
    );
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSelect(position.coords.latitude, position.coords.longitude);
        },
        () => {
          onError("Unable to get your location");
        }
      );
    }
  };

  const handleSuggestionClick = (lat: number, lon: number) => {
    onLocationSelect(lat, lon);
    setSuggestions([]);
    setLocation("");
    setOpen(false);
  };

  // Close dropdown when clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchContainerRef} className="flex flex-col md:flex-row gap-4 relative">
      <div className="flex-1 relative">
        <Input
          placeholder="Enter location..."
          value={location}
          onFocus={() => setOpen(suggestions.length > 0 || loading)}
          onChange={handleInputChange}
          className="bg-white/80 dark:bg-gray-800/80 shadow-md rounded-md"
        />
        {open && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 mt-1 rounded-md shadow-lg z-10 p-2 space-y-1">
            {loading ? (
              <div className="animate-pulse space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                ))}
              </div>
            ) : (
              suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.lat, suggestion.lon)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer rounded-md transition-colors"
                  >
                    <span className="font-semibold">{suggestion.name}</span>
                    {suggestion.state && `, ${suggestion.state}`}
                    <span className="text-sm text-gray-500 dark:text-gray-400">, {suggestion.country}</span>
                  </div>
                ))
              ) : (
                location && <div className="p-2 text-gray-500 text-center">No results found</div>
              )
            )}
          </div>
        )}
      </div>
      <Button onClick={() => fetchSuggestions(location)} className="bg-blue-600 hover:bg-blue-700">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
      <Button onClick={getCurrentLocation} variant="outline" className="bg-white/80 dark:bg-gray-800/80">
        <MapPin className="w-4 h-4 mr-2" />
        Use My Location
      </Button>
    </div>
  );
}
