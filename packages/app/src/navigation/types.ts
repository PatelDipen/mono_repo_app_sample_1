/**
 * Centralized route definitions for the entire app.
 * Both web and mobile apps use these route names and param types.
 */

export const ROUTES = {
  HOME: "Home",
  PRODUCT_LIST: "ProductList",
} as const;

export type RootStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.PRODUCT_LIST]: { title?: string };
};

export type ScreenName = keyof RootStackParamList;
