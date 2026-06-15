import { useState, useEffect, useRef, useCallback } from 'react';
import { useVisitorTracker } from './hooks/useVisitorTracker';
import { HomePage } from './components/HomePage';
import { LoginScreen } from './components/LoginScreen';
import { MyBooksLibraryPortfolio } from './components/MyBooksLibraryPortfolio';
import { GuidedBookBuilder } from './components/GuidedBookBuilder';
import { OrderFlow } from './components/OrderFlow';
import AdminArea from './components/AdminArea';
import { Footer } from './components/Footer';
import { EditorPage as BookPage } from './types/editor';
import { bookApi } from './lib/bookApi';
import { supabase } from './lib/supabase';
import { toast } from 'sonner@2.0.3';
import {
  signUpWithEmail,
  verifySignupOTP,
  signInWithEmail,
  signOut as supabaseSignOut,
  getCurrentSession,
} from './lib/authApi';
import { Toaster } from './components/ui/sonner';
import {
  saveBook,
  migrateBooksFromLocalStorage,
  migrateOrphanBooksToUser,
  isMigrationDone,
  markMigrationDone,
  isIndexedDBAvailable,
} from './utils/bookStorage';
import { dbMigrateFromLocalStorage } from './utils/dbStorage';

export interface User {
  id?: string;
  email: string;
  name: string;
  picture?: string;
}

export interface BookData {
  id: string;
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  templateId: string;
  character?: CharacterData;
  cover?: BookPage;
  pages: PageData[] | BookPage[];
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
  title?: string;
}

export interface CharacterData {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeStyle: string;
  lipStyle: string;
  outfit: string;
  accessories?: string[];
}

export interface PageData {
  id: string;
  templatePageId: string;
  texts: { [key: string]: string };
  images: { [key: string]: string };
}

export type AppScreen = 'home' | 'login' | 'library' | 'builder' | 'order';

function App() {
  useVisitorTracker();

  if (window.location.pathname === '/admin') {
    return <AdminArea />;
  }

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [user, setUser] = useState<User | null>(null);
  const [currentBook, setCurrentBook] = useState<BookData | null>(null);

  // Refs để track currentBook và user trong beforeunload và navigation guards
  const currentBookRef = useRef<BookData | null>(null);
  const userRef = useRef<User | null>(null);
  const isSavingRef = useRef(false);

  // Đồng bộ currentBook và user vào ref
  useEffect(() => {
    currentBookRef.current = currentBook;
  }, [currentBook]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Khi user login, migrate sách cũ (không có userId) sang userId hiện tại
  useEffect(() => {
    if (!user?.id) return;
    const uid = user.id;
    migrateOrphanBooksToUser(uid).then(count => {
      if (count > 0) {
        console.log(`📚 Đã gán ${count} sách vào tài khoản ${uid}`);
      }
    }).catch(err => {
      console.warn('Orphan book migration skipped:', err);
    });
  }, [user?.id]);

  const syncProfileToSupabase = async (authUser: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  }) => {
    try {
      const { error } = await supabase.from('profiles').upsert(
        {
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.fullName || authUser.email,
          avatar_url: authUser.avatarUrl || null,
        },
        {
          onConflict: 'id',
        }
      );

      if (error) {
        console.warn('⚠️ Gửi profile lên Supabase thất bại:', error);
      } else {
        console.log('✅ Gửi profile lên Supabase thành công:', authUser.email);
      }
    } catch (err) {
      console.warn('⚠️ Lỗi khi đồng bộ profile lên Supabase:', err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const activeUser = await getCurrentSession();

        if (activeUser) {
          const userData = {
            id: activeUser.id,
            email: activeUser.email,
            name: activeUser.fullName,
            picture: activeUser.avatarUrl,
          };

          await syncProfileToSupabase(activeUser);

          setUser(userData);
          localStorage.setItem('dearbook_user', JSON.stringify(userData));
          setCurrentScreen('home');
        } else {
          const savedUser = localStorage.getItem('dearbook_user');

          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setCurrentScreen('home');
          }
        }
      } catch (err) {
        console.error('Session check failed, using local storage fallback:', err);

        const savedUser = localStorage.getItem('dearbook_user');

        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setCurrentScreen('home');
        }
      }
    };

    checkSession();
  }, []);

  // Migration: di trú sách và ảnh từ localStorage sang IndexedDB (chạy 1 lần)
  useEffect(() => {
    const runMigration = async () => {
      if (isMigrationDone()) return;
      if (!isIndexedDBAvailable()) {
        console.warn('IndexedDB không khả dụng, bỏ qua migration');
        return;
      }

      try {
        console.log('🔄 Bắt đầu migration sang IndexedDB...');
        const bookCount = await migrateBooksFromLocalStorage();
        console.log(`✅ Đã migrate ${bookCount} sách`);

        const imageCount = await dbMigrateFromLocalStorage();
        console.log(`✅ Đã migrate ${imageCount} ảnh`);

        markMigrationDone();
        console.log('✅ Migration hoàn tất');
      } catch (err) {
        console.error('Migration thất bại:', err);
        // Không chặn app — vẫn chạy bình thường với localStorage
      }
    };

    runMigration();
  }, []);

  // beforeunload: backup đồng bộ vào localStorage (per-user) khi đóng tab
  useEffect(() => {
    const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
      const book = currentBookRef.current;
      const uid = userRef.current?.id || '00000000-0000-0000-0000-000000000000';
      if (book && book.id) {
        try {
          const key = 'dearbook_books_' + uid;
          const books = JSON.parse(localStorage.getItem(key) || '[]');
          const idx = books.findIndex((b: BookData) => b.id === book.id);
          if (idx >= 0) {
            books[idx] = { ...book, updatedAt: new Date().toISOString() };
          } else {
            books.push({ ...book, updatedAt: new Date().toISOString() });
          }
          localStorage.setItem(key, JSON.stringify(books));
        } catch {
          // Bỏ qua nếu localStorage đầy
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Safe save helper — lưu sách vào IndexedDB, fallback localStorage (per-user)
  const safeSaveBook = useCallback(async (book: BookData): Promise<void> => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    const uid = user?.id || '00000000-0000-0000-0000-000000000000';
    const storageKey = 'dearbook_books_' + uid;

    try {
      if (isIndexedDBAvailable()) {
        await saveBook(book, uid);
      } else {
        // Fallback localStorage nếu IDB không khả dụng
        const books = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const existingIndex = books.findIndex((b: BookData) => b.id === book.id);
        const updatedBook = { ...book, updatedAt: new Date().toISOString() };
        if (existingIndex >= 0) {
          books[existingIndex] = updatedBook;
        } else {
          books.push(updatedBook);
        }
        localStorage.setItem(storageKey, JSON.stringify(books));
      }
    } catch (err) {
      console.error('safeSaveBook failed:', err);
      // Fallback cuối cùng: localStorage
      try {
        const books = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const existingIndex = books.findIndex((b: BookData) => b.id === book.id);
        const updatedBook = { ...book, updatedAt: new Date().toISOString() };
        if (existingIndex >= 0) {
          books[existingIndex] = updatedBook;
        } else {
          books.push(updatedBook);
        }
        localStorage.setItem(storageKey, JSON.stringify(books));
      } catch {
        console.error('Hoàn toàn không thể lưu sách');
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [user]);

  const handleLogin = async (
    email: string,
    password: string,
    isSignup: boolean,
    name?: string
  ) => {
    try {
      if (isSignup) {
        await signUpWithEmail(email, password, name || email.split('@')[0]);
        toast.success('Mã OTP xác thực đã được gửi tới email của bạn!');
        return { needsOtp: true };
      }

      const authUser = await signInWithEmail(email, password);
      toast.success('Đăng nhập thành công!');

      const userData = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.fullName,
        picture: authUser.avatarUrl,
      };

      await syncProfileToSupabase(authUser);

      setTimeout(() => {
        setUser(userData);
        localStorage.setItem('dearbook_user', JSON.stringify(userData));
        setCurrentScreen('home');
      }, 2000);
    } catch (err: any) {
      console.error('Auth error:', err);
      toast.error(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      throw err;
    }
  };

  const handleVerifyOtp = async (email: string, token: string, name?: string) => {
    try {
      const authUser = await verifySignupOTP(
        email,
        token,
        name || email.split('@')[0]
      );

      toast.success('Xác thực tài khoản thành công!');

      const userData = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.fullName,
        picture: authUser.avatarUrl,
      };

      await syncProfileToSupabase(authUser);

      setUser(userData);
      localStorage.setItem('dearbook_user', JSON.stringify(userData));
      setCurrentScreen('home');
    } catch (err: any) {
      console.error('OTP verify error:', err);
      toast.error(err.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn.');
      throw err;
    }
  };

  const handleLogout = async () => {
    // Lưu sách hiện tại trước khi logout
    if (currentBook) {
      try {
        await safeSaveBook(currentBook);
      } catch (err) {
        console.error('Save before logout failed:', err);
      }
    }

    try {
      await supabaseSignOut();
    } catch (err) {
      console.error('SignOut error:', err);
    }

    setUser(null);
    setCurrentBook(null);
    localStorage.removeItem('dearbook_user');
    setCurrentScreen('login');
  };

  const handleCreateNewBook = async () => {
    // Lưu sách hiện tại trước khi tạo mới
    if (currentBook) {
      try {
        await safeSaveBook(currentBook);
      } catch (err) {
        console.error('Save before create new book failed:', err);
      }
    }
    setCurrentBook(null);
    setCurrentScreen('builder');
  };

  const handleEditBook = (book: BookData) => {
    setCurrentBook(book);
    setCurrentScreen('builder');
  };

  const handleSaveBook = async (book: BookData) => {
    const updatedBook = {
      ...book,
      updatedAt: new Date().toISOString(),
    };
    setCurrentBook(updatedBook);
    await safeSaveBook(updatedBook);

    // Đồng bộ lên backend (non-blocking)
    const userId = user?.id || '00000000-0000-0000-0000-000000000000';
    try {
      if (book.templateId) {
        const storageKey = 'dearbook_books_' + userId;
        const books = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const existingIndex = books.findIndex((b: BookData) => b.id === book.id);
        if (existingIndex < 0) {
          // Sách mới — tạo trên backend
          await bookApi.createBook(userId, {
            templateId: book.templateId,
            title: book.title || 'Sách mới',
          });
        }
      }
    } catch (err) {
      console.error('Backend sync failed (non-critical):', err);
    }
  };

  const handleBackToLibrary = async () => {
    // Lưu sách hiện tại trước khi rời builder
    if (currentBook) {
      try {
        await safeSaveBook(currentBook);
      } catch (err) {
        console.error('Save before back to library failed:', err);
      }
    }
    setCurrentBook(null);
    setCurrentScreen('library');
  };

  const handleProceedToOrder = (book: BookData) => {
    setCurrentBook(book);
    setCurrentScreen('order');
  };

  const handleOrderComplete = async () => {
    // Lưu sách trước khi hoàn tất đơn hàng
    if (currentBook) {
      try {
        await safeSaveBook(currentBook);
      } catch (err) {
        console.error('Save before order complete failed:', err);
      }
    }
    setCurrentBook(null);
    setCurrentScreen('library');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#FAFAF8' }}>
      <div className="flex-grow flex flex-col">
        <Toaster position="top-right" richColors />

        {currentScreen === 'home' && (
          <HomePage
            user={user}
            onGetStarted={() =>
              user ? setCurrentScreen('library') : setCurrentScreen('login')
            }
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen onLogin={handleLogin} onVerifyOtp={handleVerifyOtp} onBack={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'library' && user && (
          <MyBooksLibraryPortfolio
            user={user}
            onLogout={handleLogout}
            onCreateNew={handleCreateNewBook}
            onEditBook={handleEditBook}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'builder' && user && (
          <GuidedBookBuilder
            user={user}
            initialBook={currentBook}
            onSave={handleSaveBook}
            onBack={handleBackToLibrary}
            onBackToHome={() => setCurrentScreen('home')}
            onProceedToOrder={handleProceedToOrder}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'order' && user && currentBook && (
          <OrderFlow
            user={user}
            book={currentBook}
            onBack={() => setCurrentScreen('builder')}
            onComplete={handleOrderComplete}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;