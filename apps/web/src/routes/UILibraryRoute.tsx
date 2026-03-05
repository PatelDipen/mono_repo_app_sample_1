import { useNavigate } from "react-router-dom";
import { UILibraryScreen } from "@repo/app";

export function UILibraryRoute() {
  const navigate = useNavigate();

  return <UILibraryScreen onGoBack={() => navigate(-1)} />;
}
