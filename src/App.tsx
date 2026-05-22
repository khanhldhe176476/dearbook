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
import { signUpWithEmail, verifySignupOTP, signInWithEmail, signOut as supabaseSignOut, getCurrentSession } from './lib/authApi';
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
        const activeUser = await getCurrentSession();
        if (activeUser) {
          const userData = {
            id: activeUser.id,
            email: activeUser.email,
            name: activeUser.fullName,
            picture: activeUser.avatarUrl
          };
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

  const handleLogin = async (email: string, password: string, isSignup: boolean, name?: string) => {
    try {
      if (isSignup) {
        // Call Supabase signUp
        await signUpWithEmail(email, password, name || email.split('@')[0]);
        toast.success('Mã OTP xác thực đã được gửi tới email của bạn!');
        return { needsOtp: true };
      } else {
        // Call Supabase signIn
        const authUser = await signInWithEmail(email, password);
        toast.success('Đăng nhập thành công!');

        const userData = {
          id: authUser.id,
          email: authUser.email,
          name: authUser.fullName,
          picture: authUser.avatarUrl
        };

        // Try to sync profile with Spring Boot Postgres backend in background
        profileApi.updateProfile({
          id: authUser.id,
          email: authUser.email,
          fullName: authUser.fullName,
          avatarUrl: authUser.avatarUrl
        }).catch(backendErr => {
          console.warn('⚠️ Gửi profile lên Java backend thất bại:', backendErr);
        });

        // Delay state update by 2 seconds so LoginScreen displays success animation and "Correct password" bubble
        setTimeout(() => {
          setUser(userData);
          localStorage.setItem('dearbook_user', JSON.stringify(userData));
          setCurrentScreen('home');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      toast.error(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      throw err; // Propagate error back to LoginScreen so loading states reset correctly
    }
  };

  const handleVerifyOtp = async (email: string, token: string, name?: string) => {
    try {
      const authUser = await verifySignupOTP(email, token, name || email.split('@')[0]);
      toast.success('Xác thực tài khoản thành công!');

      const userData = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.fullName,
        picture: authUser.avatarUrl
      };

      // Try to sync profile with Spring Boot Postgres backend in background
      profileApi.updateProfile({
        id: authUser.id,
        email: authUser.email,
        fullName: authUser.fullName,
        avatarUrl: authUser.avatarUrl
      }).catch(backendErr => {
        console.warn('⚠️ Gửi profile lên Java backend thất bại:', backendErr);
      });

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
    
    // Use the actual logged in user id or a local fallback
    const userId = user?.id || '00000000-0000-0000-0000-000000000000'; 
    
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
        <HomePage 
          user={user}
          onGetStarted={() => user ? setCurrentScreen('library') : setCurrentScreen('login')} 
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} onVerifyOtp={handleVerifyOtp} />
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
      <Toaster />
    </div>
  );
}

export default App;