import { User } from '../App';
import { InteractiveLogoutButton } from './InteractiveLogoutButton';
import { MapPin, Phone } from 'lucide-react';

interface GoogleUserProfileProps {
  user: User;
  onLogout: () => void;
  onNavigateToProfile?: () => void;
}

export function GoogleUserProfile({ user, onLogout, onNavigateToProfile }: GoogleUserProfileProps) {
  const googleUserStr = localStorage.getItem('google_user');
  const googleUser = googleUserStr ? JSON.parse(googleUserStr) : null;
  const profilePicture = user.picture || googleUser?.picture;
  const addressParts = [user.address, user.ward, user.district, user.city].filter(Boolean);
  const compactLocation = [user.district, user.city].filter(Boolean).join(', ');
  const fullAddress = addressParts.join(', ');

  return (
    <div className="flex items-center gap-2">
      {/* User Pill */}
      <button
        type="button"
        onClick={onNavigateToProfile}
        className="flex items-center gap-2.5 px-3 py-2 transition-all hover:border-stone-400 hover:shadow-md cursor-pointer"
        title={[user.phone, fullAddress].filter(Boolean).join(' • ')}
        style={{
          background: '#fff',
          borderRadius: '999px',
          border: '1px solid #e8e4de',
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        }}
      >
        {/* Avatar */}
        {profilePicture ? (
          <img
            src={profilePicture}
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
        {/* Name only */}
        <div className="hidden sm:block leading-none max-w-[150px] text-left">
          <p className="text-sm font-semibold truncate" style={{ color: '#111' }}>{user.name}</p>
        </div>
      </button>

      {/* Logout button */}
      <InteractiveLogoutButton 
        onLogout={onLogout} 
        variant="light" 
      />
    </div>
  );
}
