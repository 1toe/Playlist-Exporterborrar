import React, { memo } from 'react';
import { CheckCircle, Copy, CopyCheck, RotateCcw } from 'lucide-react';
import { AlbumItem as AlbumItemType } from '../types';

interface AlbumItemProps {
  item: AlbumItemType;
  onCopy: (item: AlbumItemType) => void;
  onRestore?: (id: string) => void;
  onOpenRYM: (e: React.MouseEvent, item: AlbumItemType) => void;
  onOpenYTMusic: (e: React.MouseEvent, item: AlbumItemType) => void;
  isCopied: boolean;
  showCopyFeedback: boolean;
}

export const AlbumItem = memo(function AlbumItem({ 
  item, 
  onCopy, 
  onRestore, 
  onOpenRYM, 
  onOpenYTMusic, 
  isCopied, 
  showCopyFeedback 
}: AlbumItemProps) {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCopy(item);
    }
  };

  if (isCopied) {
    return (
      <li 
        onClick={() => onCopy(item)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        style={{ contentVisibility: 'auto', containIntrinsicSize: '0 72px' }}
        className="group relative bg-surface-50 border border-surface-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-brand-300 cursor-pointer transition-all flex justify-between items-center active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <div className="break-words pr-4 flex flex-wrap gap-1.5 items-center flex-1">
          <span className="font-semibold text-surface-500 line-through text-base leading-tight">{item.album}</span> 
          <span className="text-surface-400 text-sm">{item.artist}</span> 
          <span className="text-brand-600 font-mono text-xs ml-1 bg-brand-50 px-1.5 py-0.5 rounded-md opacity-60">"album"</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={(e) => onOpenRYM(e, item)}
            className="px-2.5 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            title="Abrir en RateYourMusic"
          >
            RYM
          </button>
          <button 
            onClick={(e) => onOpenYTMusic(e, item)}
            className="px-2.5 py-1.5 text-xs font-semibold bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            title="Abrir en YouTube Music"
          >
            YT Music
          </button>
          {onRestore && (
            <button 
              onClick={(e) => { e.stopPropagation(); onRestore(item.id); }}
              className="text-surface-400 hover:text-orange-500 transition-colors p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md"
              title="Marcar como no pasado"
            >
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
          <div className={`transition-colors p-1.5 ${showCopyFeedback ? 'text-green-500' : 'text-surface-300 group-hover:text-brand-500'}`}>
            {showCopyFeedback ? <CheckCircle className="w-5 h-5" aria-hidden="true" /> : <CopyCheck className="w-5 h-5" aria-hidden="true" />}
          </div>
        </div>
      </li>
    );
  }

  return (
    <li 
      onClick={() => onCopy(item)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 72px' }}
      className="group relative bg-white border border-surface-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-brand-300 cursor-pointer transition-all flex justify-between items-center active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="break-words pr-4 flex flex-wrap gap-1.5 items-center flex-1">
        <span className="font-semibold text-surface-900 text-base leading-tight">{item.album}</span> 
        <span className="text-surface-500 text-sm">{item.artist}</span> 
        <span className="text-brand-600 font-mono text-xs ml-1 bg-brand-50 px-1.5 py-0.5 rounded-md">"album"</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button 
          onClick={(e) => onOpenRYM(e, item)}
          className="px-2.5 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          title="Abrir en RateYourMusic"
        >
          RYM
        </button>
        <button 
          onClick={(e) => onOpenYTMusic(e, item)}
          className="px-2.5 py-1.5 text-xs font-semibold bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          title="Abrir en YouTube Music"
        >
          YT Music
        </button>
        <div className={`transition-colors p-1.5 ${showCopyFeedback ? 'text-green-500' : 'text-surface-300 group-hover:text-brand-500'}`}>
          {showCopyFeedback ? <CheckCircle className="w-5 h-5" aria-hidden="true" /> : <Copy className="w-5 h-5" aria-hidden="true" />}
        </div>
      </div>
    </li>
  );
});
