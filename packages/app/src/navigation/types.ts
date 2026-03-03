/**
 * Centralized route definitions for the entire app.
 * Both web and mobile apps use these route names and param types.
 */

export const ROUTES = {
  HOME: "Home",
  PRODUCT_LIST: "ProductList",
  PRODUCT_DETAILS: "ProductDetails",
} as const;

export type RootStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.PRODUCT_LIST]: { title?: string };
  [ROUTES.PRODUCT_DETAILS]: { id: string };
};

export type ScreenName = keyof RootStackParamList;
