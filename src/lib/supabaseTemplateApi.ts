import { supabase } from './supabase';

export interface BookTemplate {
  id: string;
  name: string;
  description: string;
  cover_image_url: string;
  price: number;
  is_active: boolean;
  category_id?: string;
  created_at?: string;
}

/** Mapped shape dùng cho UI */
export interface BookTemplateUI {
  id: string;
  title: string;         // <- name
  description: string;
  coverImageUrl: string; // <- cover_image_url
  price: number;
  categoryId?: string;
}

/** Lấy tất cả template đang active (is_active = true) */
export async function fetchActiveBookTemplates(): Promise<BookTemplateUI[]> {
  const { data, error } = await supabase
    .from('book_templates')
    .select('id, name, description, cover_image_url, price, is_active, category_id')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Supabase fetchActiveBookTemplates error:', error);
    throw new Error(error.message);
  }

  console.log('📦 Supabase book_templates raw data:', data);

  const mapped: BookTemplateUI[] = (data ?? []).map((row: BookTemplate) => ({
    id: row.id,
    title: row.name,
    description: row.description ?? '',
    coverImageUrl: row.cover_image_url ?? '',
    price: row.price ?? 0,
    categoryId: row.category_id,
  }));

  console.log('✅ Mapped BookTemplateUI[]:', mapped);
  return mapped;
}
