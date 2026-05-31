import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { LoginScreen } from './components/LoginScreen';
import { MyBooksLibraryPortfolio } from './components/MyBooksLibraryPortfolio';
import { GuidedBookBuilder } from './components/GuidedBookBuilder';
import { OrderFlow } from './components/OrderFlow';
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
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [user, setUser] = useState<User | null>(null);
  const [currentBook, setCurrentBook] = useState<BookData | null>(null);

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

  const handleCreateNewBook = () => {
    setCurrentBook(null);
    setCurrentScreen('builder');
  };

  const handleEditBook = (book: BookData) => {
    setCurrentBook(book);
    setCurrentScreen('builder');
  };

  const handleSaveBook = async (book: BookData) => {
    const books = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
    const existingIndex = books.findIndex((b: BookData) => b.id === book.id);
    let finalBook = { ...book };

    const userId = user?.id || '00000000-0000-0000-0000-000000000000';

    if (existingIndex >= 0) {
      books[existingIndex] = finalBook;
    } else {
      try {
        if (book.templateId) {
          const apiBook = await bookApi.createBook(userId, {
            templateId: book.templateId,
            title: book.title || 'Sách mới',
          });

          finalBook = { ...book, id: apiBook.id };
        }
      } catch (err) {
        console.error('Failed to create book on backend, using local draft:', err);
      }

      books.push(finalBook);
    }

    localStorage.setItem('dearbook_books', JSON.stringify(books));
    setCurrentBook(finalBook);
  };

  const handleBackToLibrary = () => {
    setCurrentBook(null);
    setCurrentScreen('library');
  };

  const handleProceedToOrder = (book: BookData) => {
    setCurrentBook(book);
    setCurrentScreen('order');
  };

  const handleOrderComplete = () => {
    setCurrentBook(null);
    setCurrentScreen('library');
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8' }}>
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
          onBackToHome={handleBackToLibrary}
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
  );
}

export default App;