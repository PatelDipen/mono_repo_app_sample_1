import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@repo/app";
import { HomeScreen, ROUTES } from "@repo/app";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeRoute({ navigation }: Props) {
  return (
    <HomeScreen
      onNavigateToProductList={() =>
        navigation.navigate(ROUTES.PRODUCT_LIST, {})
      }
      onNavigateToTodoList={() => navigation.navigate(ROUTES.TODO_LIST)}
      onNavigateToWeather={() => navigation.navigate(ROUTES.WEATHER)}
    />
  );
}
