import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  addTodo as apiAddTodo,
  deleteTodo as apiDeleteTodo,
  getTodos,
  type TodoApiItem,
  updateTodo as apiUpdateTodo,
} from "@repo/api";
import { getPersistStorage } from "../../state/persistStorage";

export type TodoStatus = "todo" | "inprogress" | "completed";

export interface TodoItem {
  id: string;
  title: string;
  status: TodoStatus;
  createdAt: number;
}

interface TodoState {
  todos: TodoItem[];
  isLoading: boolean;
  error: string | null;
  loadTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodoStatus: (id: string, status: TodoStatus) => Promise<void>;
  clearCompleted: () => Promise<void>;
}

const storage = getPersistStorage();

function normalizeTodoStatus(status: string | undefined): TodoStatus {
  if (status === "inprogress" || status === "completed") {
    return status;
  }

  return "todo";
}

function mapTodoItem(todo: TodoApiItem): TodoItem {
  return {
    id: String(todo.id),
    title: String(todo.title ?? "").trim(),
    status: normalizeTodoStatus(todo.status),
    createdAt: Date.now(),
  };
}

export const useTodoStore = create<TodoState>()(
  persist(
    immer((set, get) => ({
      todos: [],
      isLoading: false,
      error: null,
      loadTodos: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const todos = await getTodos();

          set((state) => {
            state.todos = todos
              .map(mapTodoItem)
              .filter((todo) => todo.title.length > 0);
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error =
              error instanceof Error ? error.message : "Unable to load todos";
          });
        }
      },
      addTodo: async (title) => {
        const normalizedTitle = title.trim();

        if (!normalizedTitle) {
          return;
        }

        set((state) => {
          state.error = null;
        });

        try {
          const createdTodo = await apiAddTodo(normalizedTitle);

          set((state) => {
            state.todos.unshift(mapTodoItem(createdTodo));
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error ? error.message : "Unable to add todo";
          });
        }
      },
      deleteTodo: async (id) => {
        set((state) => {
          state.error = null;
        });

        try {
          await apiDeleteTodo(id);

          set((state) => {
            state.todos = state.todos.filter((todo) => todo.id !== id);
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error ? error.message : "Unable to delete todo";
          });
        }
      },
      updateTodoStatus: async (id, status) => {
        const matchedTodo = get().todos.find((todo) => todo.id === id);

        if (!matchedTodo) {
          return;
        }

        set((state) => {
          state.error = null;
        });

        try {
          const updatedTodo = await apiUpdateTodo(id, {
            title: matchedTodo.title,
            status,
          });

          set((state) => {
            const currentTodo = state.todos.find((todo) => todo.id === id);

            if (currentTodo) {
              currentTodo.status = normalizeTodoStatus(updatedTodo.status);
              currentTodo.title = updatedTodo.title;
            }
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error ? error.message : "Unable to update todo";
          });
        }
      },
      clearCompleted: async () => {
        const completedTodoIds = get()
          .todos.filter((todo) => todo.status === "completed")
          .map((todo) => todo.id);

        if (completedTodoIds.length === 0) {
          return;
        }

        set((state) => {
          state.error = null;
        });

        try {
          await Promise.all(completedTodoIds.map((id) => apiDeleteTodo(id)));

          set((state) => {
            state.todos = state.todos.filter(
              (todo) => todo.status !== "completed",
            );
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error
                ? error.message
                : "Unable to clear completed todos";
          });
        }
      },
    })),
    {
      name: "todo-store",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        todos: state.todos,
      }),
    },
  ),
);
