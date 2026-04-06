import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Buscar..." }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(localValue);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localValue, onChange]);

  // Sync if external value changes (e.g., when reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="mb-6 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-surface-400" aria-hidden="true" />
      </div>
      <input 
        type="text" 
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="block w-full pl-10 pr-4 py-2.5 border border-surface-200 rounded-lg leading-5 bg-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-shadow shadow-sm"
        aria-label={placeholder}
      />
    </div>
  );
}
