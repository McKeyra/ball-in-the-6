'use client';

import { useState, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error: unknown) {
        if (process.env.NODE_ENV !== 'production') {
          // structured logging placeholder
        }
        void error;
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        // structured logging placeholder
      }
      void error;
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
