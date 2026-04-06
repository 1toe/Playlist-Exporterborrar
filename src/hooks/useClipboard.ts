import { useCallback } from 'react';

export function useClipboard() {
  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      let success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
      return success;
    } else {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Async: Could not copy text: ', err);
        return false;
      }
    }
  }, []);

  return { copy };
}
