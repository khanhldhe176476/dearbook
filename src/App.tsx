import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { LoginScreen } from './components/LoginScreen';
import { MyBooksLibraryPortfolio } from './components/MyBooksLibraryPortfolio';
import { GuidedBookBuilder } from './components/GuidedBookBuilder';
import { OrderFlow } from './components/OrderFlow';
import { PageElement, EditorPage as BookPage } from './types/editor';
import { profileApi } from './lib/profileApi';
import { bookApi } from './lib/bookApi';
import { signInWithEmail, signUpWithEmail, signOut as authSignOut, getCurrentSession, signInWithGoogleToken } from './lib/authApi';
import { Toaster, toast } from 'sonner';

export interface User {
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

// PageData is still used for the builder's local state before conversion
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

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await getCurrentSession();
        if (sessionUser) {
          setUser({
            email: sessionUser.email,
            name: sessionUser.fullName,
            picture: sessionUser.avatarUrl
          });
          setCurrentScreen('library');
        } else {
          localStorage.removeItem('dearbook_user');
        }
      } catch (err) {
        console.error('Session check failed', err);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (email: string, password: string, isSignup: boolean, name?: string) => {
    try {
      let userRes;
      if (isSignup) {
        if (!name) throw new Error('Vui lòng nhập họ và tên');
        userRes = await signUpWithEmail(email, password, name);
      } else {
        userRes = await signInWithEmail(email, password);
      }

      const userData = { 
        email: userRes.email, 
        name: userRes.fullName,
        picture: userRes.avatarUrl 
      };
      
      setUser(userData);
      localStorage.setItem('dearbook_user', JSON.stringify(userData));
      setCurrentScreen('library');
      toast.success(isSignup ? 'Đăng ký thành công!' : 'Đăng nhập thành công!');
    } catch (err: any) {
      console.error('Authentication failed:', err);
      toast.error(err.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    try {
      const userRes = await signInWithGoogleToken(idToken);
      const userData = { 
        email: userRes.email, 
        name: userRes.fullName,
        picture: userRes.avatarUrl 
      };
      
      setUser(userData);
      localStorage.setItem('dearbook_user', JSON.stringify(userData));
      setCurrentScreen('library');
      toast.success('Đăng nhập bằng Google thành công!');
    } catch (err: any) {
      console.error('Google authentication failed:', err);
      toast.error(err.message || 'Xác thực Google thất bại!');
    }
  };

  const handleLogout = async () => {
    try {
      await authSignOut();
      setUser(null);
      setCurrentBook(null);
      localStorage.removeItem('dearbook_user');
      setCurrentScreen('login');
      toast.success('Đã đăng xuất');
    } catch (err) {
      console.error('Logout error', err);
    }
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
    
    // Simulation userId
    const userId = '00000000-0000-0000-0000-000000000000'; 
    
    if (existingIndex >= 0) {
      books[existingIndex] = finalBook;
      // We could call updatePage here if we know which page changed, but MVP might just rely on local storage for drafts
    } else {
      try {
        // Only create if we have a templateId
        if (book.templateId) {
          const apiBook = await bookApi.createBook(userId, {
            templateId: book.templateId,
            title: book.title || 'Sách mới'
          });
          // Update the local book ID with the real API ID
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
        <HomePage onGetStarted={() => setCurrentScreen('login')} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />
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