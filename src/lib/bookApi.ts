import { apiGet, apiPost, apiPut } from './api';

export interface UserBook {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
  templateId: string;
}

export interface UserBookPage {
  id: string;
  userBookId: string;
  templatePageId: string;
  pageNumber: number;
  userContent: any;
}

export const bookApi = {
  getMyBooks: (userId: string) => apiGet<UserBook[]>('/api/books/my', { headers: { 'X-User-Id': userId } }),
  createBook: (userId: string, data: { templateId: string; title: string }) => 
    apiPost<UserBook>('/api/books', data, { headers: { 'X-User-Id': userId } }),
  updatePage: (userId: string, bookId: string, pageId: string, content: any) => 
    apiPut<void>(`/api/books/${bookId}/pages/${pageId}`, { userContent: content }, { headers: { 'X-User-Id': userId } }),
};
