import { useMemo, useState } from "react";
import { FlatList, Image, Platform, useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getCityForecast, searchCities, type OpenWeatherCity } from "@repo/api";
import { Button, H1, Input, Paragraph, XStack, YStack } from "@repo/ui";

interface WeatherScreenProps {
  onGoBack: () => void;
}

function getApiKey() {
  // Use exact tokens so Vite's define can do literal string replacement at build time
  const expoKey: string = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? "";
  const viteKey: string = process.env.VITE_OPENWEATHER_API_KEY ?? "";
  const rawKey = expoKey || viteKey;

  return rawKey.trim().replace(/^['"]|['"]$/g, "");
}

function formatCity(city: OpenWeatherCity) {
  const stateLabel = city.state ? `, ${city.state}` : "";
  return `${city.name}${stateLabel}, ${city.country}`;
}

function getWeatherIconUrl(icon: string) {
  const trimmedIcon = icon.trim();

  if (!trimmedIcon) {
    return "";
  }

  return `https://openweathermap.org/img/wn/${trimmedIcon}@2x.png`;
}

const CARD_BORDER_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F0B27A",
  "#82E0AA",
  "#F1948A",
  "#AED6F1",
  "#D7BDE2",
  "#A3E4D7",
];

function getCardBorderColor(index: number) {
  return CARD_BORDER_COLORS[index % CARD_BORDER_COLORS.length];
}

function formatForecastDateTime(dateTimeText: string) {
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

export function WeatherScreen({ onGoBack }: WeatherScreenProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const apiKey = getApiKey();
  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState<OpenWeatherCity | null>(
    null,
  );

  const trimmedSearch = searchText.trim();

  const {
    data: cityResults,
    isFetching: isSearchingCities,
    isError: isCitySearchError,
  } = useQuery({
    queryKey: ["openweather-city-search", trimmedSearch],
    queryFn: () => searchCities(trimmedSearch, apiKey),
    enabled: Boolean(apiKey && trimmedSearch.length >= 2),
    staleTime: 60_000,
  });

  const {
    data: forecast,
    isFetching: isFetchingForecast,
    isError: isForecastError,
  } = useQuery({
    queryKey: [
      "openweather-forecast",
      selectedCity?.lat,
      selectedCity?.lon,
      selectedCity?.name,
    ],
    queryFn: () => getCityForecast(selectedCity!, apiKey),
    enabled: Boolean(apiKey && selectedCity),
    staleTime: 10 * 60_000,
  });

  const forecastRows = useMemo(
    () => forecast?.items.slice(0, 16) ?? [],
    [forecast],
  );
  const forecastColumns = isWeb
    ? width >= 1200
      ? 4
      : width >= 900
        ? 3
        : 2
    : 1;

  return (
    <YStack flex={1} alignItems="stretch" padding="$6" gap="$4" width="100%">
      <H1>Weather</H1>

      {!apiKey ? (
        <Paragraph>
          Missing API key. Set `EXPO_PUBLIC_OPENWEATHER_API_KEY` (mobile) or
          `VITE_OPENWEATHER_API_KEY` (web).
        </Paragraph>
      ) : null}

      <Input
        size="$4"
        placeholder="Search city"
        value={searchText}
        onChangeText={setSearchText}
      />

      {trimmedSearch.length > 0 && trimmedSearch.length < 2 ? (
        <Paragraph>Type at least 2 characters to search.</Paragraph>
      ) : null}

      {isSearchingCities ? <Paragraph>Searching cities...</Paragraph> : null}
      {isCitySearchError ? (
        <Paragraph>Unable to search cities. Please try again.</Paragraph>
      ) : null}

      {cityResults && cityResults.length > 0 ? (
        <YStack gap="$2">
          {cityResults.map((city) => {
            const cityLabel = formatCity(city);
            const isSelected =
              selectedCity?.lat === city.lat && selectedCity?.lon === city.lon;

            return (
              <Button
                key={`${city.lat}-${city.lon}-${city.name}`}
                size="$3"
                onPress={() => setSelectedCity(city)}
                theme={isSelected ? "active" : undefined}
              >
                {cityLabel}
              </Button>
            );
          })}
        </YStack>
      ) : null}

      {selectedCity ? (
        <Paragraph>Selected: {formatCity(selectedCity)}</Paragraph>
      ) : null}

      {isFetchingForecast ? <Paragraph>Loading forecast...</Paragraph> : null}
      {isForecastError ? (
        <Paragraph>
          Unable to load forecast. Please choose a city again.
        </Paragraph>
      ) : null}

      {forecastRows.length > 0 ? (
        <YStack flex={1}>
          <Paragraph>
            Forecast for {forecast?.cityName}, {forecast?.country}
          </Paragraph>
          <FlatList
            key={`weather-grid-${forecastColumns}`}
            data={forecastRows}
            numColumns={forecastColumns}
            keyExtractor={(item) => String(item.timestamp)}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item, index }) => {
              const { dateLabel, timeLabel } = formatForecastDateTime(
                item.dateTimeText,
              );
              const borderColor = getCardBorderColor(index);

              return (
                <YStack
                  flex={1}
                  borderWidth={2}
                  borderColor={borderColor}
                  borderRadius="$4"
                  padding="$3"
                  margin={6}
                  gap="$1"
                  minHeight={140}
                  backgroundColor={isWeb ? undefined : "$background"}
                  {...(!isWeb && {
                    shadowColor: borderColor,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4,
                  })}
                >
                  <XStack gap="$2" alignItems="center">
                    <Paragraph>{dateLabel}</Paragraph>
                    {timeLabel ? (
                      <Paragraph fontWeight="700">{timeLabel}</Paragraph>
                    ) : null}
                  </XStack>
                  <XStack gap="$3" flexWrap="wrap">
                    <Paragraph>
                      Temp: {Math.round(item.temperature)}°C
                    </Paragraph>
                    <Paragraph>Feels: {Math.round(item.feelsLike)}°C</Paragraph>
                    <Paragraph>Humidity: {item.humidity}%</Paragraph>
                    <Paragraph>Wind: {item.windSpeed} m/s</Paragraph>
                  </XStack>
                  <XStack gap="$2" alignItems="center">
                    {item.weatherIcon ? (
                      <Image
                        source={{ uri: getWeatherIconUrl(item.weatherIcon) }}
                        style={{ width: 36, height: 36 }}
                      />
                    ) : null}
                    <Paragraph>
                      {item.weatherMain}
                      {item.weatherDescription
                        ? ` (${item.weatherDescription})`
                        : ""}
                    </Paragraph>
                  </XStack>
                </YStack>
              );
            }}
          />
        </YStack>
      ) : null}

      <Button size="$5" onPress={onGoBack}>
        Go Back
      </Button>
    </YStack>
  );
}
