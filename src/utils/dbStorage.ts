/**
 * IndexedDB storage for images — thay thế localStorage cho ảnh.
 * localStorage ~5MB, IndexedDB ~vài GB (50% disk trống).
 * Kèm sync cache để render không cần await.
 *
 * Dùng chung DB dearbook_db_v2 với bookStorage.ts.
 */

// Đồng bộ với bookStorage.ts
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
      // Books store (đồng bộ với bookStorage.ts)
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

// ── Sync cache ──────────────────────────────────────────────────────────
// IndexedDB là async, nhưng render cần giá trị ngay.
// Cache này được populate khi store / preload, dùng để tra cứu đồng bộ.
const imageCache = new Map<string, string>();

/** Export cache để các module khác có thể kiểm tra/dọn dẹp */
export { imageCache };

/**
 * Tra cứu ảnh đồng bộ từ cache (cho render).
 * 1. RAM cache → 2. localStorage → 3. trigger async load từ IndexedDB
 */
export function dbGetImageSync(key: string): string | null {
  // 1. RAM cache (đã được preload)
  if (imageCache.has(key)) return imageCache.get(key)!;

  // 2. localStorage (sync cache)
  const fromLocal = localStorage.getItem(key);
  if (fromLocal) {
    imageCache.set(key, fromLocal);
    return fromLocal;
  }

  // 3. Trigger async load từ IndexedDB (sẽ có trong cache ở lần render sau)
  if (key && key.startsWith('dearbook_image_')) {
    dbGetImage(key).then(dataUrl => {
      if (dataUrl) {
        imageCache.set(key, dataUrl);
        // Lưu vào localStorage để lần sau có sync cache
        try { localStorage.setItem(key, dataUrl); } catch { /* ignore */ }
      }
    }).catch(() => { /* ignore */ });
  }

  return null;
}

/** Preload nhiều ảnh từ IndexedDB vào cache (gọi khi mở editor) */
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
    // Fallback: thử load từ localStorage
    for (const key of toLoad) {
      const fromLocal = localStorage.getItem(key);
      if (fromLocal) imageCache.set(key, fromLocal);
    }
  }
}

/** Lưu ảnh vào IndexedDB, trả về key. Đồng thời cache + localStorage. */
export async function dbStoreImage(dataUrl: string): Promise<string> {
  const key = `dearbook_image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  imageCache.set(key, dataUrl); // cache RAM

  // Lưu vào localStorage làm sync cache (để dbGetImageSync có fallback sau khi reload)
  try {
    localStorage.setItem(key, dataUrl);
  } catch {
    // localStorage có thể đầy, bỏ qua — IndexedDB vẫn là primary
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
 * Lưu ảnh từ File/Blob trực tiếp (không cần đọc thành data URL trước).
 * Tự động đọc file thành data URL rồi lưu.
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

/** Lấy ảnh từ IndexedDB theo key */
export async function dbGetImage(key: string): Promise<string | null> {
  // Check cache trước
  if (imageCache.has(key)) return imageCache.get(key)!;

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => {
        const result = req.result?.dataUrl || null;
        if (result) imageCache.set(key, result); // cache cho lần sau
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

/** Xóa ảnh khỏi IndexedDB + cache */
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
    // Nếu không xóa được IndexedDB thì ít nhất đã xóa cache
  }
}

/** Lấy danh sách tất cả ảnh đã lưu */
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

// ── Migration ────────────────────────────────────────────────────────────

/** Di trú ảnh cũ từ localStorage sang IndexedDB */
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
        // Giữ lại localStorage copy làm backup, không xóa
        count++;
      } catch (err) {
        console.warn('Di trú ảnh thất bại:', key, err);
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
