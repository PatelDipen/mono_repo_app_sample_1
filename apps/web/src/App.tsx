import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppQueryProvider } from "@repo/app";
import { TamaguiProvider, Theme, tamaguiConfig } from "@repo/ui";
import { HomeRoute } from "./routes/HomeRoute";
import { ProductListRoute } from "./routes/ProductListRoute";

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <AppQueryProvider>
        <Theme name="light">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/product-list" element={<ProductListRoute />} />
            </Routes>
          </BrowserRouter>
        </Theme>
      </AppQueryProvider>
    </TamaguiProvider>
  );
}
