/**
 * bookStorage.ts — IndexedDB book CRUD, thay thế localStorage cho sách.
 * Dùng chung DB dearbook_db_v2 với dbStorage.ts (store 'images').
 *
 * Kiến trúc:
 *   IndexedDB (primary, GB dung lượng) → lưu book JSON + metadata (có userId)
 *   localStorage cache (secondary) → đọc nhanh không cần await, PHÂN BIỆT THEO USER
 *   In-memory Map → image cache (bên dbStorage.ts)
 */

import type { BookData } from '../App';

const DB_NAME = 'dearbook_db_v2';
const DB_VERSION = 2;
const BOOKS_STORE = 'books';
const IMAGES_STORE = 'images';

const LOCAL_BOOKS_KEY_PREFIX = 'dearbook_books_';
const MIGRATION_FLAG = 'dearbook_migration_v2_done';

/** localStorage key riêng cho từng user */
function getLocalBooksKey(userId: string): string {
  return LOCAL_BOOKS_KEY_PREFIX + userId;
}

/** Fallback: đọc tất cả sách từ localStorage cũ (chưa phân biệt user) — dùng cho migration */
function getLegacyBooksKey(): string {
  return 'dearbook_books';
}

interface BookRecord {
  id: string;
  data: string; // JSON.stringify của BookData
  updatedAt: number;
  userId: string;
  syncedToServer: boolean;
  version: number;
}

// ── Internal DB ──────────────────────────────────────────────────────────

let dbPromise: Promise<IDBDatabase> | null = null;

export function getDBPromise(): Promise<IDBDatabase> | null {
  return dbPromise;
}

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

      // Books store
      if (!db.objectStoreNames.contains(BOOKS_STORE)) {
        const bookStore = db.createObjectStore(BOOKS_STORE, { keyPath: 'id' });
        bookStore.createIndex('userId', 'userId', { unique: false });
        bookStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // Images store (đồng bộ với dbStorage.ts)
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// ── Book CRUD ────────────────────────────────────────────────────────────

/** Lưu/cập nhật sách vào IndexedDB + localStorage cache (phân biệt theo userId) */
export async function saveBook(book: BookData, userId: string): Promise<void> {
  // 1. Cập nhật localStorage cache (đồng bộ, nhanh, theo user)
  updateLocalCache(book, userId);

  // 2. Ghi IndexedDB (async, primary)
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKS_STORE, 'readwrite');
    const record: BookRecord = {
      id: book.id,
      data: JSON.stringify(book),
      updatedAt: Date.now(),
      userId,
      syncedToServer: false,
      version: 1,
    };
    tx.objectStore(BOOKS_STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Lấy tất cả sách CỦA MỘT USER từ IndexedDB (lọc theo userId) */
export async function getAllBooks(userId: string): Promise<BookData[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKS_STORE, 'readonly');
    const index = tx.objectStore(BOOKS_STORE).index('userId');
    const req = index.getAll(userId);
    req.onsuccess = () => {
      const records: BookRecord[] = req.result || [];
      const books = records.map(r => {
        try {
          return JSON.parse(r.data) as BookData;
        } catch {
          return null;
        }
      }).filter(Boolean) as BookData[];
      // Sắp xếp mới nhất trước
      books.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      resolve(books);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Lấy tất cả sách từ IndexedDB KHÔNG lọc userId.
 * CHỈ dùng cho migration và admin/debug. Không dùng cho hiển thị user.
 */
export async function getAllBooksUnfiltered(): Promise<BookData[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKS_STORE, 'readonly');
    const req = tx.objectStore(BOOKS_STORE).getAll();
    req.onsuccess = () => {
      const records: BookRecord[] = req.result || [];
      const books = records.map(r => {
        try {
          return JSON.parse(r.data) as BookData;
        } catch {
          return null;
        }
      }).filter(Boolean) as BookData[];
      books.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      resolve(books);
    };
    req.onerror = () => reject(req.error);
  });
}

/** Lấy 1 sách theo ID (không cần userId vì ID là unique) */
export async function getBook(id: string): Promise<BookData | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKS_STORE, 'readonly');
    const req = tx.objectStore(BOOKS_STORE).get(id);
    req.onsuccess = () => {
      if (req.result) {
        try {
          resolve(JSON.parse(req.result.data) as BookData);
        } catch {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

/** Xóa sách khỏi IndexedDB + localStorage cache */
export async function deleteBook(id: string, userId: string): Promise<void> {
  // Xóa khỏi localStorage cache của user
  removeFromLocalCache(id, userId);

  // Xóa khỏi IndexedDB
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKS_STORE, 'readwrite');
    tx.objectStore(BOOKS_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ── Sync Cache (localStorage) ────────────────────────────────────────────

/** Đọc nhanh từ localStorage cache cho 1 user (không cần await) */
export function getBooksSync(userId: string): BookData[] {
  try {
    const raw = localStorage.getItem(getLocalBooksKey(userId));
    if (!raw) return [];
    return JSON.parse(raw) as BookData[];
  } catch {
    return [];
  }
}

function updateLocalCache(book: BookData, userId: string): void {
  try {
    const key = getLocalBooksKey(userId);
    const books = getBooksSync(userId);
    const idx = books.findIndex(b => b.id === book.id);
    if (idx >= 0) {
      books[idx] = book;
    } else {
      books.push(book);
    }
    localStorage.setItem(key, JSON.stringify(books));
  } catch (err) {
    console.warn('Failed to update localStorage cache:', err);
  }
}

function removeFromLocalCache(id: string, userId: string): void {
  try {
    const key = getLocalBooksKey(userId);
    const books = getBooksSync(userId);
    const filtered = books.filter(b => b.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Failed to remove from localStorage cache:', err);
  }
}

/** Đồng bộ toàn bộ localStorage cache từ IndexedDB cho 1 user */
export async function syncLocalCache(userId: string): Promise<void> {
  try {
    const books = await getAllBooks(userId);
    localStorage.setItem(getLocalBooksKey(userId), JSON.stringify(books));
  } catch (err) {
    console.warn('Failed to sync localStorage cache:', err);
  }
}

// ── Migration ────────────────────────────────────────────────────────────

/** Kiểm tra xem đã migrate chưa */
export function isMigrationDone(): boolean {
  return localStorage.getItem(MIGRATION_FLAG) === 'true';
}

/** Đánh dấu migration đã hoàn thành */
export function markMigrationDone(): void {
  localStorage.setItem(MIGRATION_FLAG, 'true');
}

/**
 * Di trú sách từ localStorage cũ (dùng chung) sang IndexedDB.
 * Các sách từ localStorage cũ sẽ được gán userId rỗng.
 * Sau khi migrate, sách cũ sẽ hiển thị cho user đầu tiên login.
 */
export async function migrateBooksFromLocalStorage(): Promise<number> {
  const raw = localStorage.getItem(getLegacyBooksKey());
  if (!raw) return 0;

  let books: BookData[];
  try {
    books = JSON.parse(raw);
  } catch {
    return 0;
  }

  if (!Array.isArray(books) || books.length === 0) return 0;

  const db = await openDB();
  let count = 0;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKS_STORE, 'readwrite');
    const store = tx.objectStore(BOOKS_STORE);

    for (const book of books) {
      if (!book.id) continue;
      const record: BookRecord = {
        id: book.id,
        data: JSON.stringify(book),
        updatedAt: new Date(book.updatedAt || book.createdAt || Date.now()).getTime(),
        userId: '', // Sách cũ không có userId — sẽ được migrate khi user đầu tiên login
        syncedToServer: false,
        version: 1,
      };
      store.put(record);
      count++;
    }

    tx.oncomplete = () => {
      // Đổi tên key cũ để tránh đọc lại
      try {
        localStorage.setItem(getLegacyBooksKey() + '_migrated', raw);
        localStorage.removeItem(getLegacyBooksKey());
      } catch { /* ignore */ }
      resolve(count);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/** Di trú sách chưa có userId sang userId hiện tại */
export async function migrateOrphanBooksToUser(userId: string): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKS_STORE, 'readwrite');
    const req = tx.objectStore(BOOKS_STORE).getAll();
    req.onsuccess = () => {
      const records: BookRecord[] = req.result || [];
      let count = 0;
      for (const r of records) {
        if (!r.userId || r.userId === '') {
          r.userId = userId;
          tx.objectStore(BOOKS_STORE).put(r);
          count++;
        }
      }
      tx.oncomplete = () => resolve(count);
      tx.onerror = () => reject(tx.error);
    };
    req.onerror = () => reject(req.error);
  });
}

// ── Quota / Health ────────────────────────────────────────────────────────

/** Ước lượng dung lượng đã dùng trong IndexedDB (MB) — tất cả user */
export async function getStorageUsage(): Promise<number> {
  try {
    const books = await getAllBooksUnfiltered();
    let totalBytes = 0;
    for (const book of books) {
      totalBytes += JSON.stringify(book).length * 2; // UTF-16 estimate
    }
    return totalBytes / (1024 * 1024);
  } catch {
    return 0;
  }
}

/** Kiểm tra IndexedDB có khả dụng không */
export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined' && indexedDB !== null;
}
