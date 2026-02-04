import { useCallback, useEffect, useRef, useState } from "react";

const LOCAL_STORAGE_EVENT = "local-storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => readValue());

  const lastSerializedRef = useRef<string>("__unset__");

  useEffect(() => {
    try {
      lastSerializedRef.current = JSON.stringify(storedValue);
    } catch {
      lastSerializedRef.current = "";
    }
  }, [storedValue]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;

          let serialized = "";
          try {
            serialized = JSON.stringify(valueToStore);
          } catch {
            serialized = "";
          }

          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, serialized);
            lastSerializedRef.current = serialized;
            queueMicrotask(() => {
              window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
            });
          }

          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  // Listen for changes to other tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window === "undefined") return;

      const raw = window.localStorage.getItem(key);
      const normalizedRaw = raw ?? "";
      if (normalizedRaw === lastSerializedRef.current) return;

      queueMicrotask(() => {
        const latestRaw = window.localStorage.getItem(key);
        const latestNormalized = latestRaw ?? "";
        if (latestNormalized === lastSerializedRef.current) return;

        lastSerializedRef.current = latestNormalized;
        setStoredValue(readValue());
      });
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_EVENT, handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(LOCAL_STORAGE_EVENT, handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue] as const;
}
