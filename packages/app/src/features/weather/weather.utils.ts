import { type OpenWeatherCity } from "@repo/api";

const CARD_ACCENTS = ["blue", "green", "purple", "orange", "pink"] as const;

export function getApiKey() {
  const expoKey: string = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? "";
  const viteKey: string = process.env.VITE_OPENWEATHER_API_KEY ?? "";
  const rawKey = expoKey || viteKey;

  return rawKey.trim().replace(/^['"]|['"]$/g, "");
}

export function formatCity(city: OpenWeatherCity) {
  const stateLabel = city.state ? `, ${city.state}` : "";
  return `${city.name}${stateLabel}, ${city.country}`;
}

export function getWeatherIconUrl(icon: string) {
  const trimmedIcon = icon.trim();

  if (!trimmedIcon) {
    return "";
  }

  return `https://openweathermap.org/img/wn/${trimmedIcon}@2x.png`;
}

export function getCardAccent(index: number) {
  return CARD_ACCENTS[index % CARD_ACCENTS.length];
}

export function formatForecastDateTime(dateTimeText: string) {
  const [datePart = "", timePart = ""] = dateTimeText.split(" ");
  const [year = "", month = "", day = ""] = datePart.split("-");

  if (!year || !month || !day) {
    return {
      dateLabel: dateTimeText,
      timeLabel: "",
    };
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex = Number(month) - 1;
  const monthName = monthNames[monthIndex] ?? month;
  const dayNumber = String(Number(day));
  const timeWithoutSeconds = timePart.slice(0, 5);

  return {
    dateLabel: `${dayNumber} ${monthName}`,
    timeLabel: timeWithoutSeconds,
  };
}
