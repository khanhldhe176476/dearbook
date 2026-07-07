import { User } from '../App';
import { InteractiveLogoutButton } from './InteractiveLogoutButton';
import { useState } from 'react';
import { Camera, Loader2, MapPin, Phone, Save, UserRound, X } from 'lucide-react';
import type { AuthUser } from '../lib/authApi';
import { toast } from 'sonner@2.0.3';

interface GoogleUserProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateProfile?: (profile: AuthUser) => Promise<AuthUser>;
}

export function GoogleUserProfile({ user, onLogout, onUpdateProfile }: GoogleUserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user.name || '',
    avatarUrl: user.picture || '',
    phone: user.phone || '',
    address: user.address || '',
    ward: user.ward || '',
    district: user.district || '',
    city: user.city || '',
    postalCode: user.postalCode || '',
    shippingNote: user.shippingNote || '',
  });
  const googleUserStr = localStorage.getItem('google_user');
  const googleUser = googleUserStr ? JSON.parse(googleUserStr) : null;
  const profilePicture = user.picture || googleUser?.picture;
  const addressParts = [user.address, user.ward, user.district, user.city].filter(Boolean);
  const compactLocation = [user.district, user.city].filter(Boolean).join(', ');
  const fullAddress = addressParts.join(', ');

  const updateField = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('avatarUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateProfile || !user.id) return;

    try {
      setIsSaving(true);
      await onUpdateProfile({
        id: user.id,
        email: user.email,
        fullName: form.fullName.trim() || user.email.split('@')[0],
        avatarUrl: form.avatarUrl.trim() || undefined,
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
        ward: form.ward.trim() || undefined,
        district: form.district.trim() || undefined,
        city: form.city.trim() || undefined,
        postalCode: form.postalCode.trim() || undefined,
        shippingNote: form.shippingNote.trim() || undefined,
      });
      toast.success('Đã cập nhật hồ sơ.');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể cập nhật hồ sơ.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* User Pill */}
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2.5 px-3 py-2 transition-all"
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
        {/* Name + email */}
        <div className="hidden sm:block leading-none max-w-[220px]">
          <p className="text-sm font-semibold leading-tight" style={{ color: '#111' }}>{user.name}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: '#9ca3af' }}>{user.email}</p>
          {(user.phone || compactLocation) && (
            <div className="mt-1 flex items-center gap-2 text-[11px]" style={{ color: '#6b7280' }}>
              {user.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {user.phone}
                </span>
              )}
              {compactLocation && (
                <span className="flex min-w-0 items-center gap-1 truncate">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{compactLocation}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Logout button */}
      <InteractiveLogoutButton 
        onLogout={onLogout} 
        variant="light" 
      />

      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-4 py-6">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-bold text-stone-950">Cập nhật hồ sơ</h3>
                <p className="text-sm text-stone-500">Thông tin này sẽ dùng cho thư viện và đặt hàng.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="max-h-[75vh] overflow-y-auto px-5 py-5">
              <div className="mb-5 flex flex-col items-center gap-3">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-stone-200 bg-stone-50 text-2xl font-black text-stone-500">
                  {form.avatarUrl ? (
                    <img src={form.avatarUrl} alt={form.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-10 w-10" />
                  )}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 hover:border-stone-950">
                  <Camera className="h-4 w-4" />
                  Chọn ảnh đại diện
                  <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Tên hiển thị</span>
                  <input className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-stone-950" value={form.fullName} onChange={e => updateField('fullName', e.target.value)} required />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Số điện thoại</span>
                  <input className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-stone-950" value={form.phone} onChange={e => updateField('phone', e.target.value.replace(/[^\d+()\-\s]/g, ''))} placeholder="0987654321" required />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Địa chỉ nhận hàng</span>
                  <input className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-stone-950" value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="Số nhà, tên đường, tòa nhà..." required />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Phường / Xã</span>
                  <input className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-stone-950" value={form.ward} onChange={e => updateField('ward', e.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Quận / Huyện</span>
                  <input className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-stone-950" value={form.district} onChange={e => updateField('district', e.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Tỉnh / Thành phố</span>
                  <input className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-stone-950" value={form.city} onChange={e => updateField('city', e.target.value)} required />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Mã bưu chính</span>
                  <input className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-stone-950" value={form.postalCode} onChange={e => updateField('postalCode', e.target.value)} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Ghi chú giao hàng</span>
                  <textarea className="min-h-20 w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-stone-950" value={form.shippingNote} onChange={e => updateField('shippingNote', e.target.value)} placeholder="Gọi trước khi giao, giao giờ hành chính..." />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-bold text-stone-700">Avatar URL</span>
                  <input className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-stone-950" value={form.avatarUrl.startsWith('data:') ? '' : form.avatarUrl} onChange={e => updateField('avatarUrl', e.target.value)} placeholder="https://example.com/avatar.jpg" />
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-3 border-t border-stone-200 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-50">
                  Hủy
                </button>
                <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Lưu hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
