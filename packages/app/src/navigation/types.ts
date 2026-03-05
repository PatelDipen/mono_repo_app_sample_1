/**
 * Centralized route definitions for the entire app.
 * Both web and mobile apps use these route names and param types.
 */

export const ROUTES = {
  HOME: "Home",
  PRODUCT_LIST: "ProductList",
  PRODUCT_DETAILS: "ProductDetails",
  TODO_LIST: "TodoList",
  WEATHER: "Weather",
  UI_LIBRARY: "UILibrary",
} as const;

export type RootStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.PRODUCT_LIST]: { title?: string };
  [ROUTES.PRODUCT_DETAILS]: { id: string };
  [ROUTES.TODO_LIST]: undefined;
  [ROUTES.WEATHER]: undefined;
  [ROUTES.UI_LIBRARY]: undefined;
};

export type ScreenName = keyof RootStackParamList;
