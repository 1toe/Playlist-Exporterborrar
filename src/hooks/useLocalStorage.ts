import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        // If it's an object with empty arrays (our specific case), we can remove it to clean up
        const isDefault = JSON.stringify(storedValue) === JSON.stringify(initialValue);
        if (isDefault) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(storedValue));
        }
      } catch (error) {
        console.error('Error saving to localStorage', error);
      }
    }, 500); // Debounced save
    return () => clearTimeout(timeoutId);
  }, [key, storedValue, initialValue]);

  return [storedValue, setStoredValue];
}
