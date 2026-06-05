/**
 * IndexedDB storage for images  thay th localStorage cho nh.
 * localStorage ~5MB, IndexedDB ~vi GB (50% disk trng).
 * Km sync cache  render khng cn await.
 *
 * Dng chung DB dearbook_db_v2 vi bookStorage.ts.
 */

// ng b vi bookStorage.ts
const DB_NAME = 'dearbook_db_v2';
const DB_VERSION = 2;
const STORE_NAME = 'images';

interface ImageRecord {
  key: string;
  dataUrl: string;
  createdAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      // Images store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
      // Books store (ng b vi bookStorage.ts)
      if (!db.objectStoreNames.contains('books')) {
        const bookStore = db.createObjectStore('books', { keyPath: 'id' });
        bookStore.createIndex('userId', 'userId', { unique: false });
        bookStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

//  Sync cache 
// IndexedDB l async, nhng render cn gi tr ngay.
// Cache ny c populate khi store / preload, dng  tra cu ng b.
const imageCache = new Map<string, string>();

/** Export cache  cc module khc c th kim tra/dn dp */
export { imageCache };

/**
 * Tra cu nh ng b t cache (cho render).
 * 1. RAM cache  2. localStorage  3. trigger async load t IndexedDB
 */
export function dbGetImageSync(key: string): string | null {
  // 1. RAM cache ( c preload)
  if (imageCache.has(key)) return imageCache.get(key)!;

  // 2. localStorage (sync cache)
  const fromLocal = localStorage.getItem(key);
  if (fromLocal) {
    imageCache.set(key, fromLocal);
    return fromLocal;
  }

  // 3. Trigger async load t IndexedDB (s c trong cache  ln render sau)
  if (key && key.startsWith('dearbook_image_')) {
    dbGetImage(key).then(dataUrl => {
      if (dataUrl) {
        imageCache.set(key, dataUrl);
        // Lu vo localStorage  ln sau c sync cache
        try { localStorage.setItem(key, dataUrl); } catch { /* ignore */ }
      }
    }).catch(() => { /* ignore */ });
  }

  return null;
}

/** Preload nhiu nh t IndexedDB vo cache (gi khi m editor) */
export async function preloadImages(keys: string[]): Promise<void> {
  const uniqueKeys = [...new Set(keys.filter(k => k && k.startsWith('dearbook_image_')))];
  const toLoad = uniqueKeys.filter(k => !imageCache.has(k));
  if (toLoad.length === 0) return;

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      for (const key of toLoad) {
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => {
          if (req.result?.dataUrl) imageCache.set(key, req.result.dataUrl);
        };
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('preloadImages failed, using localStorage fallback:', err);
    // Fallback: th load t localStorage
    for (const key of toLoad) {
      const fromLocal = localStorage.getItem(key);
      if (fromLocal) imageCache.set(key, fromLocal);
    }
  }
}

/** Lu nh vo IndexedDB, tr v key. ng thi cache + localStorage. */
export async function dbStoreImage(dataUrl: string): Promise<string> {
  const key = `dearbook_image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  imageCache.set(key, dataUrl); // cache RAM

  // Lu vo localStorage lm sync cache ( dbGetImageSync c fallback sau khi reload)
  try {
    localStorage.setItem(key, dataUrl);
  } catch {
    // localStorage c th y, b qua  IndexedDB vn l primary
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ key, dataUrl, createdAt: Date.now() });
    tx.oncomplete = () => resolve(key);
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Lu nh t File/Blob trc tip (khng cn c thnh data URL trc).
 * T ng c file thnh data URL ri lu.
 */
export async function dbStoreImageFromFile(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const key = await dbStoreImage(reader.result as string);
        resolve(key);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/** Ly nh t IndexedDB theo key */
export async function dbGetImage(key: string): Promise<string | null> {
  // Check cache trc
  if (imageCache.has(key)) return imageCache.get(key)!;

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => {
        const result = req.result?.dataUrl || null;
        if (result) imageCache.set(key, result); // cache cho ln sau
        resolve(result);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // Fallback localStorage
    const fromLocal = localStorage.getItem(key);
    return fromLocal || null;
  }
}

/** Xa nh khi IndexedDB + cache */
export async function dbRemoveImage(key: string): Promise<void> {
  imageCache.delete(key);
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Nu khng xa c IndexedDB th t nht  xa cache
  }
}

/** Ly danh sch tt c nh  lu */
export async function dbGetAllImages(): Promise<Array<{ key: string; dataUrl: string }>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

/** Dn nh khng cn dng */
export async function dbCleanupUnusedImages(usedKeys: Set<string>): Promise<number> {
  const all = await dbGetAllImages();
  let cleaned = 0;
  for (const img of all) {
    if (!usedKeys.has(img.key)) {
      await dbRemoveImage(img.key);
      cleaned++;
    }
  }
  return cleaned;
}

/** Tng dung lng nh (MB) */
export async function dbGetTotalSize(): Promise<number> {
  const all = await dbGetAllImages();
  let totalBytes = 0;
  for (const img of all) {
    totalBytes += img.dataUrl.length * 0.75; // base64  binary c lng
  }
  return totalBytes / (1024 * 1024);
}

//  Migration 

/** Di tr nh c t localStorage sang IndexedDB */
export async function dbMigrateFromLocalStorage(): Promise<number> {
  let count = 0;
  const keysToMigrate: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('dearbook_image_')) {
      keysToMigrate.push(key);
    }
  }

  for (const key of keysToMigrate) {
    const dataUrl = localStorage.getItem(key);
    if (dataUrl) {
      try {
        await dbStoreImageRaw(key, dataUrl);
        // Gi li localStorage copy lm backup, khng xa
        count++;
      } catch (err) {
        console.warn('Di tr nh tht bi:', key, err);
      }
    }
  }
  return count;
}

/** Lu nh vi key c sn (dng cho migrate) */
async function dbStoreImageRaw(key: string, dataUrl: string): Promise<void> {
  imageCache.set(key, dataUrl); // cache lun
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ key, dataUrl, createdAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
