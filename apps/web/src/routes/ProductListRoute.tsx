import { useNavigate } from "react-router-dom";
import { ProductListScreen } from "@repo/app";

export function ProductListRoute() {
  const navigate = useNavigate();

  return (
    <ProductListScreen
      onGoBack={() => navigate(-1)}
      onNavigateToProductDetails={(id: string) =>
        navigate(`/product-details/${id}`)
      }
    />
  );
}
