import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@repo/app";
import { WeatherScreen } from "@repo/app";

type Props = NativeStackScreenProps<RootStackParamList, "Weather">;

export function WeatherRoute({ navigation }: Props) {
  return <WeatherScreen onGoBack={() => navigation.goBack()} />;
}
