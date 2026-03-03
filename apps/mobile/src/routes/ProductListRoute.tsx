import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@repo/app";
import { ProductListScreen, ROUTES } from "@repo/app";

type Props = NativeStackScreenProps<RootStackParamList, "ProductList">;

export function ProductListRoute({ navigation, route }: Props) {
  return (
    <ProductListScreen
      title={route.params?.title}
      onGoBack={() => navigation.goBack()}
      onNavigateToProductDetails={(id: string) =>
        navigation.navigate(ROUTES.PRODUCT_DETAILS, { id })
      }
    />
  );
}
