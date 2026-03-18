import { apiDelete, apiGet, apiPost, apiPut } from "./client";

const isWebRuntime =
  typeof globalThis !== "undefined" &&
  typeof (globalThis as { window?: unknown }).window !== "undefined";

const TODOS_BASE_URL = isWebRuntime ? "/todos" : "http://localhost:3000/todos";

export type TodoApiStatus = "todo" | "inprogress" | "completed";

export interface TodoApiItem {
  id: string | number;
  title: string;
  status: TodoApiStatus;
}

interface AddTodoRequest {
  title: string;
}

interface UpdateTodoRequest {
  title: string;
  status: TodoApiStatus;
}

export async function getTodos(): Promise<TodoApiItem[]> {
  return apiGet<TodoApiItem[]>(TODOS_BASE_URL);
}

export async function addTodo(title: string): Promise<TodoApiItem> {
  return apiPost<TodoApiItem, AddTodoRequest>(TODOS_BASE_URL, {
    title,
  });
}

export async function deleteTodo(id: string): Promise<void> {
  await apiDelete(`${TODOS_BASE_URL}/${encodeURIComponent(id)}`);
}

export async function updateTodo(
  id: string,
  payload: UpdateTodoRequest,
): Promise<TodoApiItem> {
  return apiPut<TodoApiItem, UpdateTodoRequest>(
    `${TODOS_BASE_URL}/${encodeURIComponent(id)}`,
    payload,
  );
}
