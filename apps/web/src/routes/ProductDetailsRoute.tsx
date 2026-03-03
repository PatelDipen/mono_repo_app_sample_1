import { useNavigate, useParams } from "react-router-dom";
import { ProductDetailsScreen } from "@repo/app";

export function ProductDetailsRoute() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return <ProductDetailsScreen id={id!} onGoBack={() => navigate(-1)} />;
}
