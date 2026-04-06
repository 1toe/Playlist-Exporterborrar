import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="bg-error-50 border-l-4 border-error-500 p-4 mb-6 rounded-r-lg flex items-start" role="alert">
      <AlertCircle className="h-5 w-5 text-error-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="ml-3 flex-1">
        <p className="text-sm text-error-700">{message}</p>
      </div>
      {/* Optional dismiss button would go here */}
    </div>
  );
}
