/**
 * IndexedDB storage for images — thay thế localStorage cho ảnh.
 * localStorage ~5MB, IndexedDB ~vài GB (50% disk trống).
 * Kèm sync cache để render không cần await.
 */

const DB_NAME = 'dearbook_db';
const DB_VERSION = 1;
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
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// ── Sync cache ──────────────────────────────────────────────────────────
// IndexedDB là async, nhưng render cần giá trị ngay.
// Cache này được populate khi store / preload, dùng để tra cứu đồng bộ.
const imageCache = new Map<string, string>();

/** Tra cứu ảnh đồng bộ từ cache (cho render). Fallback localStorage. */
export function dbGetImageSync(key: string): string | null {
  // Cache IndexedDB
  if (imageCache.has(key)) return imageCache.get(key)!;
  // localStorage cũ
  const fromLocal = localStorage.getItem(key);
  if (fromLocal) return fromLocal;
  return null;
}

/** Preload nhiều ảnh từ IndexedDB vào cache (gọi khi mở editor) */
export async function preloadImages(keys: string[]): Promise<void> {
  const uniqueKeys = [...new Set(keys.filter(k => k.startsWith('dearbook_image_')))];
  const toLoad = uniqueKeys.filter(k => !imageCache.has(k));
  if (toLoad.length === 0) return;

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
}

/** Lưu ảnh vào IndexedDB, trả về key. Đồng thời cache luôn. */
export async function dbStoreImage(dataUrl: string): Promise<string> {
  const key = `dearbook_image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  imageCache.set(key, dataUrl); // cache ngay
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ key, dataUrl, createdAt: Date.now() });
    tx.oncomplete = () => resolve(key);
    tx.onerror = () => reject(tx.error);
  });
}

/** Lấy ảnh từ IndexedDB theo key */
export async function dbGetImage(key: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result?.dataUrl || null);
    req.onerror = () => reject(req.error);
  });
}

/** Xóa ảnh khỏi IndexedDB + cache */
export async function dbRemoveImage(key: string): Promise<void> {
  imageCache.delete(key);
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Lấy danh sách tất cả ảnh đã lưu */
export async function dbGetAllImages(): Promise<Array<{ key: string; dataUrl: string }>> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

/** Dọn ảnh không còn dùng */
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

/** Tổng dung lượng ảnh (MB) */
export async function dbGetTotalSize(): Promise<number> {
  const all = await dbGetAllImages();
  let totalBytes = 0;
  for (const img of all) {
    totalBytes += img.dataUrl.length * 0.75; // base64 → binary ước lượng
  }
  return totalBytes / (1024 * 1024);
}

/** Di trú ảnh cũ từ localStorage sang IndexedDB */
export async function dbMigrateFromLocalStorage(): Promise<number> {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('dearbook_image_')) {
      const dataUrl = localStorage.getItem(key);
      if (dataUrl) {
        try {
          await dbStoreImageRaw(key, dataUrl);
          localStorage.removeItem(key);
          count++;
        } catch (err) {
          console.warn('Di trú ảnh thất bại:', key, err);
        }
      }
    }
  }
  return count;
}

/** Lưu ảnh với key có sẵn (dùng cho migrate) */
async function dbStoreImageRaw(key: string, dataUrl: string): Promise<void> {
  imageCache.set(key, dataUrl); // cache luôn
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ key, dataUrl, createdAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
