import React, { useState, useMemo, useCallback } from 'react';
import { Inbox, CheckCircle } from 'lucide-react';

import { AlbumItem as AlbumItemType, TabKey } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useClipboard } from './hooks/useClipboard';
import { useCSVParser } from './hooks/useCSVParser';

import { AppHeader } from './components/AppHeader';
import { ErrorBanner } from './components/ErrorBanner';
import { DropZone } from './components/DropZone';
import { TabBar } from './components/TabBar';
import { SearchBar } from './components/SearchBar';
import { AlbumList } from './components/AlbumList';
import { AlbumItem } from './components/AlbumItem';

const STORAGE_KEY = 'extractor_albums_data';

interface StorageData {
  items: AlbumItemType[];
  copied: string[];
}

export default function App() {
  const [storage, setStorage] = useLocalStorage<StorageData>(STORAGE_KEY, { items: [], copied: [] });
  
  // Safely default to empty arrays in case localStorage has unexpected data structures
  const items = storage?.items || [];
  const copiedIds = storage?.copied || [];
  
  const [currentTab, setCurrentTab] = useState<TabKey>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedFeedbackId, setCopiedFeedbackId] = useState<string | null>(null);

  const { copy } = useClipboard();
  const { parse, error, setError } = useCSVParser();

  const handleFileAccepted = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const newItems = parse(e.target.result);
        if (newItems) {
          setStorage({ items: newItems, copied: [] });
          setSearchTerm('');
          setCurrentTab('pending');
        }
      }
    };
    reader.onerror = () => setError("No pudimos leer el archivo. Intenta descargarlo de nuevo o usa otro navegador.");
    reader.readAsText(file);
  }, [parse, setError, setStorage]);

  const resetData = useCallback(() => {
    if (window.confirm(`¿Borrar los ${items.length} álbumes cargados? Perderás el progreso de los ${copiedIds.length} ya pasados.`)) {
      setStorage({ items: [], copied: [] });
      setSearchTerm('');
      setError(null);
    }
  }, [items.length, copiedIds.length, setStorage, setError]);

  const handleCopySuccess = useCallback((id: string) => {
    setCopiedFeedbackId(id);
    setTimeout(() => setCopiedFeedbackId(null), 1500);
    
    setStorage(prev => {
      const prevCopied = prev?.copied || [];
      if (!prevCopied.includes(id)) {
        return { ...prev, items: prev?.items || [], copied: [...prevCopied, id] };
      }
      return prev;
    });
  }, [setStorage]);

  const handleCopy = useCallback(async (item: AlbumItemType) => {
    await copy(item.copyText);
    handleCopySuccess(item.id);
  }, [copy, handleCopySuccess]);

  const openYTMusic = useCallback((e: React.MouseEvent, item: AlbumItemType) => {
    e.stopPropagation();
    handleCopy(item);
    const query = encodeURIComponent(item.copyText.replace(/\s+/g, ' ').trim());
    const url = `https://music.youtube.com/search?q=${query}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [handleCopy]);

  const openRYM = useCallback((e: React.MouseEvent, item: AlbumItemType) => {
    e.stopPropagation();
    handleCopy(item);
    
    const hasParentheses = item.album.includes('(') || item.album.includes(')') || item.artist.includes('(') || item.artist.includes(')');
    let url = '';
    
    if (hasParentheses) {
      const query = encodeURIComponent(`${item.album} ${item.artist}`);
      url = `https://rateyourmusic.com/search?searchterm=${query}&searchtype=`;
    } else {
      const normalizeForRym = (text: string) => {
        let normalized = text.toLowerCase().trim();
        if (normalized.startsWith('...')) {
          normalized = '_' + normalized.substring(3);
        }
        normalized = normalized.replace(/\s+/g, '-');
        normalized = normalized.replace(/[^a-z0-9-_]/g, '');
        return normalized;
      };
      
      const normArtist = normalizeForRym(item.artist);
      const normAlbum = normalizeForRym(item.album);
      url = `https://rateyourmusic.com/release/album/${normArtist}/${normAlbum}/`;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [handleCopy]);

  const restoreItem = useCallback((id: string) => {
    setStorage(prev => {
      const prevCopied = prev?.copied || [];
      return {
        ...prev,
        items: prev?.items || [],
        copied: prevCopied.filter(copiedId => copiedId !== id)
      };
    });
  }, [setStorage]);

  const copiedIdsSet = useMemo(() => new Set(copiedIds), [copiedIds]);

  const matchesSearch = useCallback((item: AlbumItemType, term: string) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return item.album.toLowerCase().includes(lowerTerm) || item.artist.toLowerCase().includes(lowerTerm);
  }, []);

  const filteredPending = useMemo(() => {
    return items.filter(item => !copiedIdsSet.has(item.id) && matchesSearch(item, searchTerm));
  }, [items, copiedIdsSet, searchTerm, matchesSearch]);

  const filteredCompleted = useMemo(() => {
    return items.filter(item => copiedIdsSet.has(item.id) && matchesSearch(item, searchTerm));
  }, [items, copiedIdsSet, searchTerm, matchesSearch]);

  return (
    <div className="min-h-screen bg-transparent font-sans text-surface-800 selection:bg-brand-200 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <AppHeader 
          title="Pasa tus Álbumes a YouTube Music"
          subtitle="Sube el archivo de tu biblioteca musical y busca cada álbum rápidamente."
          onReset={resetData}
          showReset={items.length > 0}
        />

        {error && <ErrorBanner message={error} />}

        {items.length === 0 ? (
          <DropZone onFileAccepted={handleFileAccepted} />
        ) : (
          <div>
            <TabBar 
              activeTab={currentTab}
              onTabChange={(key) => setCurrentTab(key as TabKey)}
              tabs={[
                { key: 'pending', label: 'Por pasar', count: items.length - copiedIds.length },
                { key: 'completed', label: 'Pasados', count: copiedIds.length }
              ]}
            />

            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar, ej: Dark Side of the Moon"
            />

            <div className="max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {currentTab === 'pending' ? (
                <AlbumList 
                  items={filteredPending}
                  emptyIcon={<Inbox className="w-10 h-10" />}
                  emptyMessage={searchTerm ? `No hay álbumes que coincidan con "${searchTerm}". Prueba con otro nombre.` : "¡Felicidades! Has terminado de pasar todos tus álbumes."}
                  renderItem={(item) => (
                    <AlbumItem 
                      key={item.id}
                      item={item}
                      isCopied={false}
                      showCopyFeedback={copiedFeedbackId === item.id}
                      onCopy={handleCopy}
                      onOpenRYM={openRYM}
                      onOpenYTMusic={openYTMusic}
                    />
                  )}
                />
              ) : (
                <div className="opacity-80 hover:opacity-100 transition-opacity">
                  <AlbumList 
                    items={filteredCompleted}
                    emptyIcon={<CheckCircle className="w-10 h-10" />}
                    emptyMessage={searchTerm ? `No hay álbumes que coincidan con "${searchTerm}". Prueba con otro nombre.` : "Haz clic en cualquier álbum de la pestaña 'Por pasar' para empezar."}
                    renderItem={(item) => (
                      <AlbumItem 
                        key={item.id}
                        item={item}
                        isCopied={true}
                        showCopyFeedback={copiedFeedbackId === item.id}
                        onCopy={handleCopy}
                        onRestore={restoreItem}
                        onOpenRYM={openRYM}
                        onOpenYTMusic={openYTMusic}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
