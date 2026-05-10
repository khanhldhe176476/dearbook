import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => void | Promise<void>;
  interval?: number; // milliseconds, default 30000 (30 seconds)
  enabled?: boolean;
  debounceTime?: number; // milliseconds, default 2000
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveReturn {
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  forceSave: () => void;
  isSaving: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  interval = 30000,
  enabled = true,
  debounceTime = 2000,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const dataRef = useRef(data);
  const lastSavedDataRef = useRef<string>(JSON.stringify(data));
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Update data ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const performSave = useCallback(async () => {
    if (isSaving) return;

    const currentData = dataRef.current;
    const currentDataString = JSON.stringify(currentData);

    // Check if data has changed
    if (currentDataString === lastSavedDataRef.current) {
      setSaveStatus('saved');
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus('saving');
      
      await onSave(currentData);
      
      lastSavedDataRef.current = currentDataString;
      setLastSavedAt(new Date());
      setSaveStatus('saved');
      
      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  }, [onSave, isSaving]);

  const forceSave = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    performSave();
  }, [performSave]);

  // Debounced save on data change
  useEffect(() => {
    if (!enabled) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const currentDataString = JSON.stringify(data);
      if (currentDataString !== lastSavedDataRef.current) {
        performSave();
      }
    }, debounceTime);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [data, enabled, debounceTime, performSave]);

  // Periodic auto-save
  useEffect(() => {
    if (!enabled) return;

    saveTimeoutRef.current = setInterval(() => {
      const currentDataString = JSON.stringify(dataRef.current);
      if (currentDataString !== lastSavedDataRef.current && !isSaving) {
        performSave();
      }
    }, interval);

    return () => {
      if (saveTimeoutRef.current) {
        clearInterval(saveTimeoutRef.current);
      }
    };
  }, [enabled, interval, performSave, isSaving]);

  // Save before unload
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const currentDataString = JSON.stringify(dataRef.current);
      if (currentDataString !== lastSavedDataRef.current) {
        e.preventDefault();
        e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời đi?';
        
        // Try to save synchronously (best effort)
        onSave(dataRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, onSave]);

  return {
    saveStatus,
    lastSavedAt,
    forceSave,
    isSaving,
  };
}
