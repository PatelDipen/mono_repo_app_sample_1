import { useNavigate, useParams } from "react-router-dom";
import { TodoListScreen } from "@repo/app";

export function TodoListRoute() {
  const navigate = useNavigate();

  return <TodoListScreen onGoBack={() => navigate(-1)} />;
}
