import { apiGet, apiPost } from './api';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  ward?: string;
  district?: string;
  city?: string;
  postalCode?: string;
  shippingNote?: string;
}

export const profileApi = {
  getMyProfile: (userId: string) => apiGet<Profile>('/api/profiles/me', { headers: { 'X-User-Id': userId } }),
  updateProfile: (data: Profile) => apiPost<Profile>('/api/profiles', data),
};
