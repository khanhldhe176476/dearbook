import { apiGet, apiPost } from './api';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export const profileApi = {
  getMyProfile: (userId: string) => apiGet<Profile>('/api/profiles/me', { headers: { 'X-User-Id': userId } }),
  updateProfile: (data: Profile) => apiPost<Profile>('/api/profiles', data),
};
