import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { LoginScreen } from './components/LoginScreen';
import { MyBooksLibraryPortfolio } from './components/MyBooksLibraryPortfolio';
import { GuidedBookBuilder } from './components/GuidedBookBuilder';
import { OrderFlow } from './components/OrderFlow';
import { PageElement, EditorPage as BookPage } from './types/editor';
import { profileApi } from './lib/profileApi';
import { bookApi } from './lib/bookApi';
import { toast } from 'sonner@2.0.3';
import { signInWithEmail, signUpWithEmail, getCurrentSession, signOut } from './lib/authApi';

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
    const initSession = async () => {
      try {
        const sessionUser = await getCurrentSession();
        if (sessionUser) {
          const userData = {
            email: sessionUser.email,
            name: sessionUser.fullName,
            picture: sessionUser.avatarUrl,
          };
          setUser(userData);
          localStorage.setItem('dearbook_user', JSON.stringify(userData));
          setCurrentScreen('library');
        } else {
          // Fallback to local storage if no session
          const savedUser = localStorage.getItem('dearbook_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setCurrentScreen('library');
          }
        }
      } catch (e) {
        console.error('Session check error:', e);
      }
    };
    initSession();
  }, []);

  const handleLogin = async (email: string, password: string, isSignup: boolean, name?: string) => {
    try {
      let authUser;
      if (isSignup) {
        if (!name) {
          toast.error('Vui lòng nhập họ và tên');
          return;
        }
        authUser = await signUpWithEmail(email, password, name);
        toast.success('Đăng ký thành công!');
      } else {
        authUser = await signInWithEmail(email, password);
        toast.success('Đăng nhập thành công!');
      }

      const userData = {
        email: authUser.email,
        name: authUser.fullName,
        picture: authUser.avatarUrl,
      };
      
      setUser(userData);
      localStorage.setItem('dearbook_user', JSON.stringify(userData));
      setCurrentScreen('library');
    } catch (err: any) {
      console.error('Auth error:', err);
      toast.error(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('Signout error:', e);
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
      {currentScreen === 'home' && (
        <HomePage onGetStarted={() => setCurrentScreen('login')} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
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