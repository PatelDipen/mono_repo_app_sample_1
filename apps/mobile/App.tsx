import { TamaguiProvider, Theme, tamaguiConfig } from "@repo/ui";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@repo/app";
import { AppQueryProvider, ROUTES } from "@repo/app";
import { HomeRoute } from "./src/routes/HomeRoute";
import { ProductListRoute } from "./src/routes/ProductListRoute";
import { ProductDetailsRoute } from "./src/routes/ProductDetailsRoute";
import { TodoListRoute } from "./src/routes/TodoListRoute";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <AppQueryProvider>
        <Theme name="light">
          <NavigationContainer>
            <Stack.Navigator initialRouteName={ROUTES.HOME}>
              <Stack.Screen
                name={ROUTES.HOME}
                component={HomeRoute}
                options={{ title: "Home" }}
              />
              <Stack.Screen
                name={ROUTES.PRODUCT_LIST}
                component={ProductListRoute}
                options={{ title: "Product List" }}
              />
              <Stack.Screen
                name={ROUTES.PRODUCT_DETAILS}
                component={ProductDetailsRoute}
                options={{ title: "Product Details" }}
              />
              <Stack.Screen
                name={ROUTES.TODO_LIST}
                component={TodoListRoute}
                options={{ title: "Todo List" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Theme>
      </AppQueryProvider>
    </TamaguiProvider>
  );
}
