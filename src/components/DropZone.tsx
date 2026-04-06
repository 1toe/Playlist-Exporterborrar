import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  isDisabled?: boolean;
}

export function DropZone({ onFileAccepted, isDisabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isDisabled) setIsDragging(true);
  }, [isDisabled]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isDisabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileAccepted(e.dataTransfer.files[0]);
    }
  }, [isDisabled, onFileAccepted]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileAccepted(e.target.files[0]);
    }
  }, [onFileAccepted]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isDisabled) fileInputRef.current?.click();
    }
  }, [isDisabled]);

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border p-8 mb-8 text-center transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${isDragging ? 'border-brand-400 bg-brand-50' : 'border-surface-200'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !isDisabled && fileInputRef.current?.click()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label="Zona para subir archivo CSV"
    >
      <input 
        type="file" 
        id="csv-file" 
        accept=".csv" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileInput}
        disabled={isDisabled}
      />
      <div className="flex flex-col items-center justify-center space-y-4 group pointer-events-none">
        <div className="p-4 bg-brand-50 rounded-lg text-brand-500 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
          <UploadCloud className="w-8 h-8" aria-hidden="true" />
        </div>
        <div>
          <span className="text-brand-600 font-semibold group-hover:underline">Sube el archivo CSV de tu biblioteca</span>
          <span className="text-surface-500"> o arrástralo aquí</span>
        </div>
        <p className="text-xs text-surface-400">Exporta tu biblioteca desde Spotify o Apple Music y súbela aquí en formato .csv</p>
      </div>
    </div>
  );
}
