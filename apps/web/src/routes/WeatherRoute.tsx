import { useNavigate } from "react-router-dom";
import { WeatherScreen } from "@repo/app";

export function WeatherRoute() {
  const navigate = useNavigate();

  return <WeatherScreen onGoBack={() => navigate(-1)} />;
}
