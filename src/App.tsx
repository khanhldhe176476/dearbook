import { useState, useEffect, useRef, useCallback } from 'react';
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
  getAllBooks,
  migrateBooksFromLocalStorage,
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
  if (window.location.pathname === '/admin') {
    return <AdminArea />;
  }

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [user, setUser] = useState<User | null>(null);
  const [currentBook, setCurrentBook] = useState<BookData | null>(null);

  // Refs  track currentBook trong beforeunload v navigation guards
  const currentBookRef = useRef<BookData | null>(null);
  const isSavingRef = useRef(false);

  // ng b currentBook vo ref
  useEffect(() => {
    currentBookRef.current = currentBook;
  }, [currentBook]);

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
        console.warn(' Gi profile ln Supabase tht bi:', error);
      } else {
        console.log(' Gi profile ln Supabase thnh cng:', authUser.email);
      }
    } catch (err) {
      console.warn(' Li khi ng b profile ln Supabase:', err);
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

  // Migration: di tr sch v nh t localStorage sang IndexedDB (chy 1 ln)
  useEffect(() => {
    const runMigration = async () => {
      if (isMigrationDone()) return;
      if (!isIndexedDBAvailable()) {
        console.warn('IndexedDB khng kh dng, b qua migration');
        return;
      }

      try {
        console.log(' Bt u migration sang IndexedDB...');
        const bookCount = await migrateBooksFromLocalStorage();
        console.log(`  migrate ${bookCount} sch`);

        const imageCount = await dbMigrateFromLocalStorage();
        console.log(`  migrate ${imageCount} nh`);

        markMigrationDone();
        console.log(' Migration hon tt');
      } catch (err) {
        console.error('Migration tht bi:', err);
        // Khng chn app  vn chy bnh thng vi localStorage
      }
    };

    runMigration();
  }, []);

  // beforeunload: backup ng b vo localStorage khi ng tab
  useEffect(() => {
    const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
      const book = currentBookRef.current;
      if (book && book.id) {
        try {
          const books = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
          const idx = books.findIndex((b: BookData) => b.id === book.id);
          if (idx >= 0) {
            books[idx] = { ...book, updatedAt: new Date().toISOString() };
          } else {
            books.push({ ...book, updatedAt: new Date().toISOString() });
          }
          localStorage.setItem('dearbook_books', JSON.stringify(books));
        } catch {
          // B qua nu localStorage y
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Safe save helper  lu sch vo IndexedDB, fallback localStorage
  const safeSaveBook = useCallback(async (book: BookData): Promise<void> => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    try {
      if (isIndexedDBAvailable()) {
        const userId = user?.id || '00000000-0000-0000-0000-000000000000';
        await saveBook(book, userId);
      } else {
        // Fallback localStorage nu IDB khng kh dng
        const books = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
        const existingIndex = books.findIndex((b: BookData) => b.id === book.id);
        const updatedBook = { ...book, updatedAt: new Date().toISOString() };
        if (existingIndex >= 0) {
          books[existingIndex] = updatedBook;
        } else {
          books.push(updatedBook);
        }
        localStorage.setItem('dearbook_books', JSON.stringify(books));
      }
    } catch (err) {
      console.error('safeSaveBook failed:', err);
      // Fallback cui cng: localStorage
      try {
        const books = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
        const existingIndex = books.findIndex((b: BookData) => b.id === book.id);
        const updatedBook = { ...book, updatedAt: new Date().toISOString() };
        if (existingIndex >= 0) {
          books[existingIndex] = updatedBook;
        } else {
          books.push(updatedBook);
        }
        localStorage.setItem('dearbook_books', JSON.stringify(books));
      } catch {
        console.error('Hon ton khng th lu sch');
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
        toast.success('M OTP xc thc  c gi ti email ca bn!');
        return { needsOtp: true };
      }

      const authUser = await signInWithEmail(email, password);
      toast.success('ng nhp thnh cng!');

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
      toast.error(err.message || 'C li xy ra, vui lng th li.');
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

      toast.success('Xc thc ti khon thnh cng!');

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
      toast.error(err.message || 'M xc thc khng hp l hoc  ht hn.');
      throw err;
    }
  };

  const handleLogout = async () => {
    // Lu sch hin ti trc khi logout
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
    // Lu sch hin ti trc khi to mi
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

    // ng b ln backend (non-blocking)
    const userId = user?.id || '00000000-0000-0000-0000-000000000000';
    try {
      if (book.templateId) {
        const books = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
        const existingIndex = books.findIndex((b: BookData) => b.id === book.id);
        if (existingIndex < 0) {
          // Sch mi  to trn backend
          await bookApi.createBook(userId, {
            templateId: book.templateId,
            title: book.title || 'Sch mi',
          });
        }
      }
    } catch (err) {
      console.error('Backend sync failed (non-critical):', err);
    }
  };

  const handleBackToLibrary = async () => {
    // Lu sch hin ti trc khi ri builder
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
    // Lu sch trc khi hon tt n hng
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