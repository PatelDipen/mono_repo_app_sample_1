import { useNavigate, useSearchParams } from "react-router-dom";
import { ProductListScreen } from "@repo/app";

export function ProductListRoute() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));
  const currentPage = Number.isInteger(page) && page > 0 ? page : 1;

  return (
    <ProductListScreen
      onGoBack={() => navigate(-1)}
      initialWebPage={currentPage}
      onWebPageChange={(nextPage) => {
        if (nextPage > 1) {
          setSearchParams({ page: String(nextPage) });
          return;
        }

        setSearchParams({});
      }}
      onNavigateToProductDetails={(id: string) =>
        navigate(`/product-details/${id}`)
      }
    />
  );
}
