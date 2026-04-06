import React, { ReactNode } from 'react';
import { AlbumItem as AlbumItemType } from '../types';

interface AlbumListProps {
  items: AlbumItemType[];
  emptyIcon: ReactNode;
  emptyMessage: string;
  renderItem: (item: AlbumItemType) => ReactNode;
}

export function AlbumList({ items, emptyIcon, emptyMessage, renderItem }: AlbumListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-surface-400 flex flex-col items-center">
        <div className="mb-3 text-surface-300">
          {emptyIcon}
        </div>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 pb-10">
      {items.map(item => renderItem(item))}
    </ul>
  );
}
