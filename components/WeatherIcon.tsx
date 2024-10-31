import { CloudRain, Sun, Cloud, CloudSnow, CloudLightning, CloudFog } from "lucide-react";

interface WeatherIconProps {
  description: string;
  size?: number;
}

export function WeatherIcon({ description, size = 24 }: WeatherIconProps) {
  const desc = description.toLowerCase();
  const iconProps = { size, className: "text-blue-600 dark:text-blue-400" };

  if (desc.includes("rain")) {
    return <CloudRain {...iconProps} />;
  } else if (desc.includes("cloud")) {
    return <Cloud {...iconProps} />;
  } else if (desc.includes("snow")) {
    return <CloudSnow {...iconProps} />;
  } else if (desc.includes("thunder")) {
    return <CloudLightning {...iconProps} />;
  } else if (desc.includes("fog") || desc.includes("mist")) {
    return <CloudFog {...iconProps} />;
  }
  return <Sun {...iconProps} />;
}