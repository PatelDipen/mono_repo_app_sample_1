import { useNavigate } from "react-router-dom";
import { HomeScreen } from "@repo/app";

export function HomeRoute() {
  const navigate = useNavigate();

  return (
    <HomeScreen onNavigateToProductList={() => navigate("/product-list")} />
  );
}
