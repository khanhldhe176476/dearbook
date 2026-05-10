import { useState, useCallback, useRef, useEffect } from 'react';

interface UseUndoRedoOptions<T> {
  initialState: T;
  maxHistory?: number;
  onStateChange?: (state: T) => void;
}

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
  historyLength: number;
  currentIndex: number;
}

export function useUndoRedo<T>({
  initialState,
  maxHistory = 50,
  onStateChange,
}: UseUndoRedoOptions<T>): UseUndoRedoReturn<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isInternalChange = useRef(false);

  const state = history[currentIndex];

  const setState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      isInternalChange.current = true;

      setHistory((prev) => {
        const resolvedState =
          typeof newState === 'function'
            ? (newState as (prev: T) => T)(prev[currentIndex])
            : newState;

        // Check if state actually changed
        if (JSON.stringify(resolvedState) === JSON.stringify(prev[currentIndex])) {
          return prev;
        }

        // Remove all forward history when making a new change
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(resolvedState);

        // Limit history size
        if (newHistory.length > maxHistory) {
          newHistory.shift();
          setCurrentIndex(maxHistory - 1);
        } else {
          setCurrentIndex(newHistory.length - 1);
        }

        return newHistory;
      });

      setTimeout(() => {
        isInternalChange.current = false;
      }, 0);
    },
    [currentIndex, maxHistory]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      isInternalChange.current = true;
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => {
        isInternalChange.current = false;
      }, 0);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      isInternalChange.current = true;
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => {
        isInternalChange.current = false;
      }, 0);
    }
  }, [currentIndex, history.length]);

  const clearHistory = useCallback(() => {
    setHistory([state]);
    setCurrentIndex(0);
  }, [state]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Notify state changes
  useEffect(() => {
    if (!isInternalChange.current && onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    clearHistory,
    historyLength: history.length,
    currentIndex,
  };
}
