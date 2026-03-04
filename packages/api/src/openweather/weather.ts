import { apiGet } from "../client";

const OPENWEATHER_GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const OPENWEATHER_FORECAST_URL =
  "https://api.openweathermap.org/data/2.5/forecast";

export interface OpenWeatherCity {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface OpenWeatherForecastResponse {
  city: {
    name: string;
    country: string;
  };
  list: Array<{
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
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
}

export interface ForecastItem {
  timestamp: number;
  dateTimeText: string;
  temperature: number;
  feelsLike: number;
  minTemperature: number;
  maxTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherMain: string;
  weatherDescription: string;
  weatherIcon: string;
}

export interface CityForecast {
  cityName: string;
  country: string;
  items: ForecastItem[];
}

export async function searchCities(
  query: string,
  apiKey: string,
): Promise<OpenWeatherCity[]> {
  const normalizedQuery = query.trim();
  const normalizedApiKey = apiKey.trim();

  if (!normalizedQuery) {
    return [];
  }

  if (!normalizedApiKey) {
    throw new Error("Missing OpenWeather API key");
  }

  const params = new URLSearchParams({
    q: normalizedQuery,
    limit: "8",
    appid: normalizedApiKey,
  });

  return apiGet<OpenWeatherCity[]>(
    `${OPENWEATHER_GEO_URL}?${params.toString()}`,
  );
}

export async function getCityForecast(
  city: Pick<OpenWeatherCity, "lat" | "lon">,
  apiKey: string,
): Promise<CityForecast> {
  const normalizedApiKey = apiKey.trim();

  if (!normalizedApiKey) {
    throw new Error("Missing OpenWeather API key");
  }

  const params = new URLSearchParams({
    lat: String(city.lat),
    lon: String(city.lon),
    units: "metric",
    appid: normalizedApiKey,
  });

  const data = await apiGet<OpenWeatherForecastResponse>(
    `${OPENWEATHER_FORECAST_URL}?${params.toString()}`,
  );

  return {
    cityName: data.city.name,
    country: data.city.country,
    items: data.list.map((entry) => ({
      timestamp: entry.dt,
      dateTimeText: entry.dt_txt,
      temperature: entry.main.temp,
      feelsLike: entry.main.feels_like,
      minTemperature: entry.main.temp_min,
      maxTemperature: entry.main.temp_max,
      humidity: entry.main.humidity,
      windSpeed: entry.wind.speed,
      weatherMain: entry.weather[0]?.main ?? "",
      weatherDescription: entry.weather[0]?.description ?? "",
      weatherIcon: entry.weather[0]?.icon ?? "",
    })),
  };
}
