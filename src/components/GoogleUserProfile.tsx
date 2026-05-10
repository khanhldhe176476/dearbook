import { User } from '../App';
import { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';

interface GoogleUserProfileProps {
  user: User;
  onLogout: () => void;
}

export function GoogleUserProfile({ user, onLogout }: GoogleUserProfileProps) {
  const googleUserStr = localStorage.getItem('google_user');
  const googleUser = googleUserStr ? JSON.parse(googleUserStr) : null;

  if (googleUser && googleUser.picture) {
    return (
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-2xl"
          style={{ background: 'rgba(250,250,248,0.85)', backdropFilter: 'blur(8px)', border: '1px solid #DDD8D0' }}
        >
          <img
            src={googleUser.picture}
            alt={user.name}
            className="w-9 h-9 rounded-full"
            style={{ border: '2px solid #EDE9E3' }}
            referrerPolicy="no-referrer"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold" style={{ color: '#3A2E28' }}>{user.name}</p>
            <p className="text-xs" style={{ color: '#9B9088' }}>{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
          style={{ background: '#EDE9E3', color: '#5A5049' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#DDD8D0')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    );
  }

  // Regular email/password user
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-2xl"
        style={{ background: 'rgba(250,250,248,0.85)', backdropFilter: 'blur(8px)', border: '1px solid #DDD8D0' }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ background: '#3A2E28', color: '#EDE9E3' }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold" style={{ color: '#3A2E28' }}>{user.name}</p>
          <p className="text-xs" style={{ color: '#9B9088' }}>{user.email}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
        style={{ background: '#EDE9E3', color: '#5A5049' }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#DDD8D0')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#EDE9E3')}
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Đăng xuất</span>
      </button>
    </div>
  );
}