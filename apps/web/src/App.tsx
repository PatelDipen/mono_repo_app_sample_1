import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TamaguiProvider, Theme, tamaguiConfig } from "@repo/ui";
import { HomeRoute } from "./routes/HomeRoute";
import { ProductListRoute } from "./routes/ProductListRoute";

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <Theme name="light">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/product-list" element={<ProductListRoute />} />
          </Routes>
        </BrowserRouter>
      </Theme>
    </TamaguiProvider>
  );
}
