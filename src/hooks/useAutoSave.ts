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
  forceSave: () => Promise<void>;
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
  const saveTimeoutRef = useRef<ReturnType<typeof setInterval>>();
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isSavingRef = useRef(false);

  // Update data ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const performSave = useCallback(async () => {
    if (isSavingRef.current) return;

    const currentData = dataRef.current;
    const currentDataString = JSON.stringify(currentData);

    // Check if data has changed
    if (currentDataString === lastSavedDataRef.current) {
      setSaveStatus('saved');
      return;
    }

    try {
      isSavingRef.current = true;
      setIsSaving(true);
      setSaveStatus('saving');

      await onSave(currentData);

      lastSavedDataRef.current = currentDataString;
      setLastSavedAt(new Date());
      setSaveStatus('saved');

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
      }, 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus((prev) => (prev === 'error' ? 'idle' : prev));
      }, 3000);
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }, [onSave]);

  const forceSave = useCallback(async () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (saveTimeoutRef.current) {
      clearInterval(saveTimeoutRef.current);
    }
    await performSave();
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
      if (currentDataString !== lastSavedDataRef.current && !isSavingRef.current) {
        performSave();
      }
    }, interval);

    return () => {
      if (saveTimeoutRef.current) {
        clearInterval(saveTimeoutRef.current);
      }
    };
  }, [enabled, interval, performSave]);

  // Save before unload  ng b vo localStorage lm backup
  // (IndexedDB l async nn khng m bo kp khi tab ng)
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const currentDataString = JSON.stringify(dataRef.current);
      if (currentDataString !== lastSavedDataRef.current) {
        // Backup ng b vo localStorage
        try {
          const key = 'dearbook_autosave_backup';
          localStorage.setItem(key, JSON.stringify({
            data: dataRef.current,
            timestamp: Date.now(),
          }));
        } catch {
          // localStorage c th y, b qua
        }

        e.preventDefault();
        e.returnValue = 'Bn c thay i cha c lu. Bn c chc mun ri i?';

        // Th async save (best effort)
        onSave(dataRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, onSave]);

  // Restore backup nu c (khi hook mount)
  useEffect(() => {
    try {
      const backupRaw = localStorage.getItem('dearbook_autosave_backup');
      if (backupRaw) {
        const backup = JSON.parse(backupRaw);
        if (backup.data && backup.timestamp) {
          // Ch restore nu backup mi hn last saved
          const backupStr = JSON.stringify(backup.data);
          if (backupStr !== lastSavedDataRef.current) {
            console.log(' Found auto-save backup from', new Date(backup.timestamp).toLocaleString());
            // Khng t ng restore   component cha quyt nh
          }
        }
        localStorage.removeItem('dearbook_autosave_backup');
      }
    } catch {
      // B qua
    }
  }, []);

  return {
    saveStatus,
    lastSavedAt,
    forceSave,
    isSaving,
  };
}
