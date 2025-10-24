'use client';

import { useState, useCallback, useRef } from 'react';
import { EditableElement, HistoryState } from '@/types/editor.types';

export function useEditorState() {
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);

  const saveToHistory = useCallback((html: string) => {
    const newState: HistoryState = {
      html,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newState];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      return history[historyIndex - 1].html;
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      return history[historyIndex + 1].html;
    }
    return null;
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    selectedElement,
    setSelectedElement,
    zoom,
    setZoom,
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
