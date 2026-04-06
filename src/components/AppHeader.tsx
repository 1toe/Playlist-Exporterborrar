import React from 'react';
import { Disc3, Trash2 } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle: string;
  onReset?: () => void;
  showReset: boolean;
}

export function AppHeader({ title, subtitle, onReset, showReset }: AppHeaderProps) {
  return (
    <header className="mb-8 relative flex flex-col items-start">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 text-brand-600 mb-4 shadow-sm">
        <Disc3 className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="flex w-full justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-900 mb-1 tracking-tight">{title}</h1>
          <p className="text-surface-500 text-sm">{subtitle}</p>
          <p className="text-xs text-brand-500 mt-1.5">Al hacer clic, copiamos el texto exacto para que encuentres el álbum en YouTube Music.</p>
        </div>
        {showReset && onReset && (
          <button 
            onClick={onReset}
            className="p-2 text-xs font-medium text-error-600 hover:bg-error-50 rounded-md transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500" 
            title="Cargar otro CSV"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Nueva lista</span>
          </button>
        )}
      </div>
    </header>
  );
}
