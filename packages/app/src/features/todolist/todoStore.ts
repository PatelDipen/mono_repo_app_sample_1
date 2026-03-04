import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

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

interface LocalStorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

function getWebLocalStorage() {
  const globalWithLocalStorage = globalThis as {
    localStorage?: LocalStorageLike;
  };

  return globalWithLocalStorage.localStorage;
}

const webStorage: StateStorage = {
  getItem: (name) => {
    const localStorageRef = getWebLocalStorage();

    if (!localStorageRef) {
      return null;
    }

    return localStorageRef.getItem(name);
  },
  setItem: (name, value) => {
    const localStorageRef = getWebLocalStorage();

    if (!localStorageRef) {
      return;
    }

    localStorageRef.setItem(name, value);
  },
  removeItem: (name) => {
    const localStorageRef = getWebLocalStorage();

    if (!localStorageRef) {
      return;
    }

    localStorageRef.removeItem(name);
  },
};

function createNativeStorage(): StateStorage {
  return {
    getItem: (name) => AsyncStorage.getItem(name),
    setItem: (name, value) => AsyncStorage.setItem(name, value),
    removeItem: (name) => AsyncStorage.removeItem(name),
  };
}

const storage = Platform.OS === "web" ? webStorage : createNativeStorage();

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
