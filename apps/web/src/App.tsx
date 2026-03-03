import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppQueryProvider } from "@repo/app";
import { TamaguiProvider, Theme, tamaguiConfig } from "@repo/ui";
import { HomeRoute } from "./routes/HomeRoute";
import { ProductListRoute } from "./routes/ProductListRoute";
import { ProductDetailsRoute } from "./routes/ProductDetailsRoute";
import { TodoListRoute } from "./routes/TodoListRoute";

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <AppQueryProvider>
        <Theme name="light">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/product-list" element={<ProductListRoute />} />
              <Route
                path="/product-details/:id"
                element={<ProductDetailsRoute />}
              />
              <Route path="/todo-list" element={<TodoListRoute />} />
            </Routes>
          </BrowserRouter>
        </Theme>
      </AppQueryProvider>
    </TamaguiProvider>
  );
}
