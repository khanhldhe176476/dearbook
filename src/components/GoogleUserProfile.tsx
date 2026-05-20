import { User } from '../App';
import { LogOut } from 'lucide-react';

interface GoogleUserProfileProps {
  user: User;
  onLogout: () => void;
}

export function GoogleUserProfile({ user, onLogout }: GoogleUserProfileProps) {
  const googleUserStr = localStorage.getItem('google_user');
  const googleUser = googleUserStr ? JSON.parse(googleUserStr) : null;
  const hasGooglePicture = googleUser && googleUser.picture;

  return (
    <div className="flex items-center gap-2">
      {/* User Pill */}
      <div
        className="flex items-center gap-2.5 px-3 py-2 transition-all"
        style={{
          background: '#fff',
          borderRadius: '999px',
          border: '1px solid #e8e4de',
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        }}
      >
        {/* Avatar */}
        {hasGooglePicture ? (
          <img
            src={googleUser.picture}
            alt={user.name}
            className="w-8 h-8 rounded-full flex-shrink-0"
            style={{ border: '1.5px solid #e8e4de', objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{ background: '#111', color: '#f3e9d7' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        {/* Name + email */}
        <div className="hidden sm:block leading-none">
          <p className="text-sm font-semibold leading-tight" style={{ color: '#111' }}>{user.name}</p>
          <p className="text-xs mt-0.5" style={{ color: '#bbb' }}>{user.email}</p>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        title="Đăng xuất"
        className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium transition-all hover:opacity-80 active:scale-95"
        style={{
          background: '#fff',
          borderRadius: '999px',
          border: '1px solid #e8e4de',
          color: '#666',
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f5f2ee'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; }}
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Đăng xuất</span>
      </button>
    </div>
  );
}