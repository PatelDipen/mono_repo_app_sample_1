import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@repo/app";
import { ProductDetailsScreen } from "@repo/app";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetails">;

export function ProductDetailsRoute({ navigation, route }: Props) {
  return (
    <ProductDetailsScreen
      id={route.params?.id}
      onGoBack={() => navigation.goBack()}
    />
  );
}
