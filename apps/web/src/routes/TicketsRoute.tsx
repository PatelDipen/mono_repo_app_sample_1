import { useNavigate } from "react-router-dom";
import { TicketsScreen } from "@repo/app";

export function TicketsRoute() {
  const navigate = useNavigate();

  return <TicketsScreen onGoBack={() => navigate(-1)} />;
}
