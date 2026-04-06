import { useState, useCallback } from 'react';
import { AlbumItem } from '../types';

export function useCSVParser() {
  const [error, setError] = useState<string | null>(null);

  const parseCSVText = useCallback((text: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"' && text[i+1] === '"') {
            currentCell += '"'; i++; 
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell); currentCell = '';
        } else if (char === '\n' && !inQuotes) {
            currentRow.push(currentCell); rows.push(currentRow);
            currentRow = []; currentCell = '';
        } else if (char === '\r') {
            continue;
        } else {
            currentCell += char;
        }
    }
    if (currentRow.length > 0 || currentCell !== '') {
        currentRow.push(currentCell); rows.push(currentRow);
    }
    return rows;
  }, []);

  const parse = useCallback((csvText: string): AlbumItem[] | null => {
    setError(null);
    const rows = parseCSVText(csvText);
    if (rows.length < 2) {
      setError("Este archivo no parece un CSV válido. Asegúrate de exportarlo correctamente.");
      return null;
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    let artistIndex = -1, albumIndex = -1;

    headers.forEach((header, index) => {
      if (header.includes('artist')) artistIndex = index;
      if (header.includes('album')) albumIndex = index;
    });

    if (artistIndex === -1 || albumIndex === -1) {
      setError("Tu CSV necesita columnas llamadas 'artist' y 'album'. Revisa que la primera fila tenga estos encabezados.");
      return null;
    }

    const uniqueMap = new Map<string, AlbumItem>();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length > Math.max(artistIndex, albumIndex)) {
        const artist = row[artistIndex].trim();
        const album = row[albumIndex].trim();
        if (artist && album) {
          const id = `${album}-${artist}`.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!uniqueMap.has(id)) {
            uniqueMap.set(id, {
              id,
              album,
              artist,
              copyText: `${album} ${artist} "album"`
            });
          }
        }
      }
    }

    const newItems = Array.from(uniqueMap.values()).sort((a, b) => a.album.localeCompare(b.album));
    if (newItems.length === 0) {
      setError("No encontramos álbumes en tu archivo. Asegúrate de que tenga datos debajo de los encabezados.");
      return null;
    }

    return newItems;
  }, [parseCSVText]);

  return { parse, error, setError };
}
