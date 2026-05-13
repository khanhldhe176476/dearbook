import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { LoginScreen } from './components/LoginScreen';
import { MyBooksLibraryPortfolio } from './components/MyBooksLibraryPortfolio';
import { GuidedBookBuilder } from './components/GuidedBookBuilder';
import { OrderFlow } from './components/OrderFlow';
import { PageElement, EditorPage as BookPage } from './types/editor';

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
    const savedUser = localStorage.getItem('dearbook_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentScreen('library');
    }
  }, []);

  const handleLogin = (email: string, password: string, name?: string, picture?: string) => {
    const userData = { 
      email, 
      name: name || email.split('@')[0],
      picture 
    };
    setUser(userData);
    localStorage.setItem('dearbook_user', JSON.stringify(userData));
    setCurrentScreen('library');
  };

  const handleLogout = () => {
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

  const handleSaveBook = (book: BookData) => {
    const books = JSON.parse(localStorage.getItem('dearbook_books') || '[]');
    const existingIndex = books.findIndex((b: BookData) => b.id === book.id);
    
    if (existingIndex >= 0) {
      books[existingIndex] = book;
    } else {
      books.push(book);
    }
    
    localStorage.setItem('dearbook_books', JSON.stringify(books));
    setCurrentBook(book);
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