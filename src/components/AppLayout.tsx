import { ReactNode } from 'react';
import { BookOpen, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { User } from '../App';

interface AppLayoutProps {
  user: User;
  onLogout: () => void;
  onBackToDashboard?: () => void;
  children: ReactNode;
  showBackButton?: boolean;
}

export function AppLayout({ user, onLogout, onBackToDashboard, children, showBackButton = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToDashboard}>
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold font-handwriting gradient-text">Bookify</span>
              </div>

              {showBackButton && onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </button>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center ${user.avatar ? 'hidden' : ''}`}>
                  <span className="text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="btn btn-ghost flex items-center gap-2"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
