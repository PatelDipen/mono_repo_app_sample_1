import { useMemo, useState } from "react";
import { FlatList, Platform, useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getCityForecast, searchCities, type OpenWeatherCity } from "@repo/api";
import {
  AppScreen,
  Button,
  H1,
  Input,
  ListActionButton,
  MutedText,
  Paragraph,
  ScreenActions,
  ScreenHeader,
  YStack,
} from "@repo/ui";
import { ForecastCard } from "./ForecastCard";
import { formatCity, getApiKey } from "./weather.utils";

interface WeatherScreenProps {
  onGoBack: () => void;
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
    <AppScreen>
      <ScreenHeader>
        <H1>Weather</H1>
      </ScreenHeader>

      {!apiKey ? (
        <MutedText>
          Missing API key. Set `EXPO_PUBLIC_OPENWEATHER_API_KEY` (mobile) or
          `VITE_OPENWEATHER_API_KEY` (web).
        </MutedText>
      ) : null}

      <Input
        size="$4"
        placeholder="Search city"
        value={searchText}
        onChangeText={setSearchText}
      />

      {trimmedSearch.length > 0 && trimmedSearch.length < 2 ? (
        <MutedText>Type at least 2 characters to search.</MutedText>
      ) : null}

      {isSearchingCities ? <MutedText>Searching cities...</MutedText> : null}
      {isCitySearchError ? (
        <MutedText>Unable to search cities. Please try again.</MutedText>
      ) : null}

      {cityResults && cityResults.length > 0 ? (
        <YStack gap="$2">
          {cityResults.map((city) => {
            const cityLabel = formatCity(city);
            const isSelected =
              selectedCity?.lat === city.lat && selectedCity?.lon === city.lon;

            return (
              <ListActionButton
                key={`${city.lat}-${city.lon}-${city.name}`}
                size="$3"
                onPress={() => setSelectedCity(city)}
                theme={isSelected ? "active" : undefined}
              >
                {cityLabel}
              </ListActionButton>
            );
          })}
        </YStack>
      ) : null}

      {selectedCity ? (
        <Paragraph>Selected: {formatCity(selectedCity)}</Paragraph>
      ) : null}

      {isFetchingForecast ? <MutedText>Loading forecast...</MutedText> : null}
      {isForecastError ? (
        <MutedText>
          Unable to load forecast. Please choose a city again.
        </MutedText>
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
            renderItem={({ item, index }) => (
              <ForecastCard item={item} index={index} />
            )}
          />
        </YStack>
      ) : null}

      <ScreenActions>
        <Button size="$5" onPress={onGoBack}>
          Go Back
        </Button>
      </ScreenActions>
    </AppScreen>
  );
}
