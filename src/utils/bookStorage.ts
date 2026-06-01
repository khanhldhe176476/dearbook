/**
 * bookStorage.ts — IndexedDB book CRUD, thay thế localStorage cho sách.
 * Dùng chung DB dearbook_db_v2 với dbStorage.ts (store 'images').
 *
 * Kiến trúc:
 *   IndexedDB (primary, GB dung lượng) → lưu book JSON + metadata
 *   localStorage cache (secondary) → đọc nhanh không cần await
 *   In-memory Map → image cache (bên dbStorage.ts)
 */

import type { BookData } from '../App';

const DB_NAME = 'dearbook_db_v2';
const DB_VERSION = 2;
const BOOKS_STORE = 'books';
const IMAGES_STORE = 'images';

const LOCAL_BOOKS_KEY = 'dearbook_books';
const MIGRATION_FLAG = 'dearbook_migration_v2_done';

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

/** Lưu/cập nhật sách vào IndexedDB + localStorage cache */
export async function saveBook(book: BookData, userId: string): Promise<void> {
  // 1. Cập nhật localStorage cache (đồng bộ, nhanh)
  updateLocalCache(book);

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

/** Lấy tất cả sách từ IndexedDB */
export async function getAllBooks(): Promise<BookData[]> {
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
      // Sắp xếp mới nhất trước
      books.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      resolve(books);
    };
    req.onerror = () => reject(req.error);
  });
}

/** Lấy 1 sách theo ID */
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
export async function deleteBook(id: string): Promise<void> {
  // Xóa khỏi localStorage cache
  removeFromLocalCache(id);

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

/** Đọc nhanh từ localStorage cache (không cần await) */
export function getBooksSync(): BookData[] {
  try {
    const raw = localStorage.getItem(LOCAL_BOOKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BookData[];
  } catch {
    return [];
  }
}

function updateLocalCache(book: BookData): void {
  try {
    const books = getBooksSync();
    const idx = books.findIndex(b => b.id === book.id);
    if (idx >= 0) {
      books[idx] = book;
    } else {
      books.push(book);
    }
    localStorage.setItem(LOCAL_BOOKS_KEY, JSON.stringify(books));
  } catch (err) {
    console.warn('Failed to update localStorage cache:', err);
  }
}

function removeFromLocalCache(id: string): void {
  try {
    const books = getBooksSync();
    const filtered = books.filter(b => b.id !== id);
    localStorage.setItem(LOCAL_BOOKS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Failed to remove from localStorage cache:', err);
  }
}

/** Đồng bộ toàn bộ localStorage cache từ IndexedDB */
export async function syncLocalCache(): Promise<void> {
  try {
    const books = await getAllBooks();
    localStorage.setItem(LOCAL_BOOKS_KEY, JSON.stringify(books));
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
 * Di trú sách từ localStorage sang IndexedDB.
 * Giữ lại localStorage copy làm cache.
 */
export async function migrateBooksFromLocalStorage(): Promise<number> {
  const raw = localStorage.getItem(LOCAL_BOOKS_KEY);
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
        userId: '',
        syncedToServer: false,
        version: 1,
      };
      store.put(record);
      count++;
    }

    tx.oncomplete = () => resolve(count);
    tx.onerror = () => reject(tx.error);
  });
}

// ── Quota / Health ────────────────────────────────────────────────────────

/** Ước lượng dung lượng đã dùng trong IndexedDB (MB) */
export async function getStorageUsage(): Promise<number> {
  try {
    const books = await getAllBooks();
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
