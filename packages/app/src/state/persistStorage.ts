import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type StateStorage } from "zustand/middleware";

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

export function getPersistStorage(): StateStorage {
  return Platform.OS === "web" ? webStorage : createNativeStorage();
}
