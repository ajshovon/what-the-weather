"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  const handleLocationSearch = async () => {
    if (!location.trim()) return;

    try {
      const response = await fetch(`/api/location/${encodeURIComponent(location)}`);
      const data = await response.json();
      const { lat, lon } = data[0];
      onLocationSelect(lat, lon);
      setSuggestions(data);
      setOpen(true);
    } catch (error) {
      onError("Failed to search location");
    }
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

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
      <Input
              placeholder="Enter location..."
              value={location}
              onFocus={() => setOpen(true)}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-white/80 dark:bg-gray-800/80"
            />
      </div>
      <Button onClick={handleLocationSearch} className="bg-blue-600 hover:bg-blue-700">
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
