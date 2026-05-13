import { apiGet } from './api';

export interface Template {
  id: string;
  name: string;
  description?: string;
  coverImageUrl: string;
  price: number;
  categoryId: string;
}

export interface TemplatePage {
  id: string;
  templateId: string;
  pageNumber: number;
  layoutType: string;
  defaultContent: any;
}

export const templateApi = {
  getTemplates: () => apiGet<Template[]>('/api/public/templates'),
  getTemplate: (id: string) => apiGet<Template>(`/api/public/templates/${id}`),
  getTemplatePages: (id: string) => apiGet<TemplatePage[]>(`/api/public/templates/${id}/pages`),
};
