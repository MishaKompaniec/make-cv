import { useCallback, useState } from "react";

export function useLocalStorage<T>(_key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => (value instanceof Function ? value(prev) : value));
  }, []);

  return [storedValue, setValue] as const;
}
