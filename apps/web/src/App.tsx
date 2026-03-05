import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppQueryProvider } from "@repo/app";
import { TamaguiProvider, Theme, tamaguiConfig } from "@repo/ui";
import { HomeRoute } from "./routes/HomeRoute";
import { ProductListRoute } from "./routes/ProductListRoute";
import { ProductDetailsRoute } from "./routes/ProductDetailsRoute";
import { TodoListRoute } from "./routes/TodoListRoute";
import { WeatherRoute } from "./routes/WeatherRoute";
import { UILibraryRoute } from "./routes/UILibraryRoute";

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
              <Route path="/weather" element={<WeatherRoute />} />
              <Route path="/ui-library" element={<UILibraryRoute />} />
            </Routes>
          </BrowserRouter>
        </Theme>
      </AppQueryProvider>
    </TamaguiProvider>
  );
}
