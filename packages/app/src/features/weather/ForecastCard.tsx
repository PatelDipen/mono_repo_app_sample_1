import { Image } from "react-native";
import { type ForecastItem } from "@repo/api";
import { Paragraph, SectionLabel, SurfaceCard, XStack, YStack } from "@repo/ui";
import {
  formatForecastDateTime,
  getCardAccent,
  getWeatherIconUrl,
} from "./weather.utils";

interface ForecastCardProps {
  item: ForecastItem;
  index: number;
}

export function ForecastCard({ item, index }: ForecastCardProps) {
  const { dateLabel, timeLabel } = formatForecastDateTime(item.dateTimeText);
  const accent = getCardAccent(index);

  return (
    <SurfaceCard
      flex={1}
      margin={6}
      minHeight={140}
      emphasis="medium"
      accent={accent}
      gap="$1"
    >
      <XStack gap="$2" alignItems="center">
        <SectionLabel>{dateLabel}</SectionLabel>
        {timeLabel ? <Paragraph fontWeight="700">{timeLabel}</Paragraph> : null}
      </XStack>

      <XStack gap="$3" flexWrap="wrap">
        <Paragraph>Temp: {Math.round(item.temperature)}°C</Paragraph>
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
        <YStack flex={1}>
          <Paragraph>
            {item.weatherMain}
            {item.weatherDescription ? ` (${item.weatherDescription})` : ""}
          </Paragraph>
        </YStack>
      </XStack>
    </SurfaceCard>
  );
}
