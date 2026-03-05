import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";
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
  addTodo: (title: string) => void;
  deleteTodo: (id: string) => void;
  updateTodoStatus: (id: string, status: TodoStatus) => void;
  clearCompleted: () => void;
}

const storage = getPersistStorage();

function createTodoId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useTodoStore = create<TodoState>()(
  persist(
    immer((set) => ({
      todos: [],
      addTodo: (title) => {
        const normalizedTitle = title.trim();

        if (!normalizedTitle) {
          return;
        }

        set((state) => {
          state.todos.unshift({
            id: createTodoId(),
            title: normalizedTitle,
            status: "todo",
            createdAt: Date.now(),
          });
        });
      },
      deleteTodo: (id) =>
        set((state) => {
          state.todos = state.todos.filter((todo) => todo.id !== id);
        }),
      updateTodoStatus: (id, status) =>
        set((state) => {
          const matchedTodo = state.todos.find((todo) => todo.id === id);

          if (matchedTodo) {
            matchedTodo.status = status;
          }
        }),
      clearCompleted: () =>
        set((state) => {
          state.todos = state.todos.filter(
            (todo) => todo.status !== "completed",
          );
        }),
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
