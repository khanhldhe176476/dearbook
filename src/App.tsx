import { useState, useEffect, useRef, useCallback } from 'react';
import { useVisitorTracker } from './hooks/useVisitorTracker';
import { HomePage } from './components/HomePage';
import { LoginScreen } from './components/LoginScreen';
import { MyBooksLibraryPortfolio } from './components/MyBooksLibraryPortfolio';
import { GuidedBookBuilder } from './components/GuidedBookBuilder';
import { OrderFlow } from './components/OrderFlow';
import { UserProfilePage } from './components/UserProfilePage';
import AdminArea from './components/AdminArea';
import { Footer } from './components/Footer';
import { EditorPage as BookPage } from './types/editor';
import { bookApi } from './lib/bookApi';
import { toast } from 'sonner@2.0.3';
import {
  signUpWithEmail,
  verifySignupOTP,
  signInWithEmail,
  signOut as supabaseSignOut,
  getCurrentSession,
  updateUserProfile,
  type AuthUser,
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
import { dbGetImage, dbMigrateFromLocalStorage } from './utils/dbStorage';

export interface User {
  id?: string;
  email: string;
  name: string;
  picture?: string;
  phone?: string;
  address?: string;
  ward?: string;
  district?: string;
  city?: string;
  shippingNote?: string;
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

export type AppScreen = 'home' | 'login' | 'library' | 'builder' | 'order' | 'profile';

async function embedStoredImagesForServer<T>(value: T): Promise<T> {
  if (typeof value === 'string') {
    if (value.startsWith('dearbook_image_')) {
      return ((await dbGetImage(value)) || value) as T;
    }
    return value;
  }

  if (Array.isArray(value)) {
    return Promise.all(value.map(item => embedStoredImagesForServer(item))) as T;
  }

  if (value && typeof value === 'object') {
    const entries = await Promise.all(
      Object.entries(value as Record<string, unknown>).map(async ([key, item]) => [
        key,
        await embedStoredImagesForServer(item),
      ])
    );
    return Object.fromEntries(entries) as T;
  }

  return value;
}

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
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());

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

  const syncUserProfile = async (authUser: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  }) => {
    try {
      await updateUserProfile({
        id: authUser.id,
        email: authUser.email,
        fullName: authUser.fullName || authUser.email,
        avatarUrl: authUser.avatarUrl,
        phone: authUser.phone,
        address: authUser.address,
        ward: authUser.ward,
        district: authUser.district,
        city: authUser.city,
        shippingNote: authUser.shippingNote,
      });

      console.log('Profile synced successfully:', authUser.email);
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
            phone: activeUser.phone,
            address: activeUser.address,
            ward: activeUser.ward,
            district: activeUser.district,
            city: activeUser.city,
            shippingNote: activeUser.shippingNote,
          };

          await syncUserProfile(activeUser);

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
    const backupCurrentBookToLocal = () => {
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

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        backupCurrentBookToLocal();
      }
    };

    window.addEventListener('beforeunload', backupCurrentBookToLocal);
    window.addEventListener('pagehide', backupCurrentBookToLocal);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', backupCurrentBookToLocal);
      window.removeEventListener('pagehide', backupCurrentBookToLocal);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Safe save helper — lưu sách vào IndexedDB, fallback localStorage (per-user)
  const safeSaveBook = useCallback(async (book: BookData): Promise<void> => {
    const uid = user?.id || '00000000-0000-0000-0000-000000000000';
    const storageKey = 'dearbook_books_' + uid;
    const bookToSave = { ...book, updatedAt: book.updatedAt || new Date().toISOString() };

    const saveTask = async () => {
      try {
        if (isIndexedDBAvailable()) {
          await saveBook(bookToSave, uid);
        } else {
          // Fallback localStorage nếu IDB không khả dụng
          const books = JSON.parse(localStorage.getItem(storageKey) || '[]');
          const existingIndex = books.findIndex((b: BookData) => b.id === bookToSave.id);
          const updatedBook = bookToSave;
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
          const existingIndex = books.findIndex((b: BookData) => b.id === bookToSave.id);
          const updatedBook = bookToSave;
          if (existingIndex >= 0) {
            books[existingIndex] = updatedBook;
          } else {
            books.push(updatedBook);
          }
          localStorage.setItem(storageKey, JSON.stringify(books));
        } catch {
          console.error('Hoàn toàn không thể lưu sách');
        }
      }

      try {
        const serverBook = await embedStoredImagesForServer(bookToSave);
        await bookApi.saveSnapshot(uid, serverBook);
      } catch (err) {
        console.warn('Backend book snapshot sync failed (local save is kept):', err);
      }

    };

    saveChainRef.current = saveChainRef.current.catch(() => undefined).then(saveTask);
    return saveChainRef.current;
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
        phone: authUser.phone,
        address: authUser.address,
        ward: authUser.ward,
        district: authUser.district,
        city: authUser.city,
        shippingNote: authUser.shippingNote,
      };

      await syncUserProfile(authUser);

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

  const handleVerifyOtp = async (email: string, token: string, name?: string): Promise<AuthUser> => {
    try {
      const authUser = await verifySignupOTP(
        email,
        token,
        name || email.split('@')[0]
      );

      toast.success('Xác thực tài khoản thành công! Hoàn tất hồ sơ để bắt đầu.');
      return authUser;
    } catch (err: any) {
      console.error('OTP verify error:', err);
      toast.error(err.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn.');
      throw err;
    }
  };

  const handleCompleteSignupProfile = async (profile: AuthUser) => {
    try {
      const updatedProfile = await updateUserProfile(profile);
      toast.success('Hồ sơ đã được cập nhật!');

      const userData = {
        id: updatedProfile.id,
        email: updatedProfile.email,
        name: updatedProfile.fullName,
        picture: updatedProfile.avatarUrl,
        phone: updatedProfile.phone,
        address: updatedProfile.address,
        ward: updatedProfile.ward,
        district: updatedProfile.district,
        city: updatedProfile.city,
        shippingNote: updatedProfile.shippingNote,
      };

      setUser(userData);
      localStorage.setItem('dearbook_user', JSON.stringify(userData));
      setCurrentScreen('home');
    } catch (err: any) {
      console.error('Complete profile error:', err);
      toast.error(err.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại.');
      throw err;
    }
  };

  const handleUpdateProfile = async (profile: AuthUser) => {
    const updatedProfile = await updateUserProfile(profile);
    const userData = {
      id: updatedProfile.id,
      email: updatedProfile.email,
      name: updatedProfile.fullName,
      picture: updatedProfile.avatarUrl,
      phone: updatedProfile.phone,
      address: updatedProfile.address,
      ward: updatedProfile.ward,
      district: updatedProfile.district,
      city: updatedProfile.city,
      shippingNote: updatedProfile.shippingNote,
    };

    setUser(userData);
    localStorage.setItem('dearbook_user', JSON.stringify(userData));
    return updatedProfile;
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
    currentBookRef.current = book;
    setCurrentBook(book);
    setCurrentScreen('builder');
  };

  const handleSaveBook = async (book: BookData) => {
    const updatedBook = {
      ...book,
      updatedAt: new Date().toISOString(),
    };
    currentBookRef.current = updatedBook;
    setCurrentBook(updatedBook);
    await safeSaveBook(updatedBook);
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

  const shouldShowFooter = currentScreen === 'home' || currentScreen === 'login' || currentScreen === 'library';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8' }}>
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
          <LoginScreen
            onLogin={handleLogin}
            onVerifyOtp={handleVerifyOtp}
            onCompleteProfile={handleCompleteSignupProfile}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'library' && user && (
          <MyBooksLibraryPortfolio
            user={user}
            onLogout={handleLogout}
            onCreateNew={handleCreateNewBook}
            onEditBook={handleEditBook}
            onUpdateProfile={handleUpdateProfile}
            onBackToHome={() => setCurrentScreen('home')}
            onNavigateToProfile={() => setCurrentScreen('profile')}
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

        {currentScreen === 'profile' && user && (
          <UserProfilePage
            user={user}
            onBackToLibrary={() => setCurrentScreen('library')}
            onUpdateProfile={handleUpdateProfile}
            onEditBook={handleEditBook}
          />
        )}
      </div>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;
