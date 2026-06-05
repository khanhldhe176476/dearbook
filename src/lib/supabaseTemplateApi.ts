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

/** Mapped shape dng cho UI */
export interface BookTemplateUI {
  id: string;
  title: string;         // <- name
  description: string;
  coverImageUrl: string; // <- cover_image_url
  price: number;
  categoryId?: string;
}

/** D liu mu fallback khi Supabase li permission */
const FALLBACK_TEMPLATES_UI: BookTemplateUI[] = [
  { id: 'template-love-1', title: 'Tnh Yu Mi Mi', description: 'Mu sch lng mn dnh cho cc cp i.', coverImageUrl: '', price: 299000 },
  { id: 'template-family-1', title: 'K c Gia nh', description: 'Cun sch nh gia nh m p.', coverImageUrl: '', price: 349000 },
  { id: 'template-birthday-1', title: 'Sinh Nht c Bit', description: 'Tng ngi thn mn qu  ngha.', coverImageUrl: '', price: 249000 },
  { id: 'template-wedding-1', title: 'Ngy Ci Hnh Phc', description: 'Album ci cao cp.', coverImageUrl: '', price: 499000 },
  { id: 'template-travel-1', title: 'Hnh Trnh Khm Ph', description: 'Ghi li nhng chuyn du lch ng nh.', coverImageUrl: '', price: 299000 },
  { id: 'template-kids-1', title: 'Tui Th Ti p', description: 'Sch nh dnh cho b.', coverImageUrl: '', price: 279000 },
];

/** Ly tt c template ang active (is_active = true) */
export async function fetchActiveBookTemplates(): Promise<BookTemplateUI[]> {
  try {
    const { data, error } = await supabase
      .from('book_templates')
      .select('id, name, description, cover_image_url, price, is_active, category_id')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn(' fetchActiveBookTemplates error  dng fallback:', error.message);
      return FALLBACK_TEMPLATES_UI;
    }

    console.log(' Supabase book_templates raw data:', data);

    if (!data || data.length === 0) {
      console.warn(' Khng c d liu t Supabase  dng fallback templates.');
      return FALLBACK_TEMPLATES_UI;
    }

    const mapped: BookTemplateUI[] = data.map((row: BookTemplate) => ({
      id: row.id,
      title: row.name,
      description: row.description ?? '',
      coverImageUrl: row.cover_image_url ?? '',
      price: row.price ?? 0,
      categoryId: row.category_id,
    }));

    console.log(' Mapped BookTemplateUI[]:', mapped);
    return mapped;
  } catch (err: any) {
    console.warn(' fetchActiveBookTemplates exception  dng fallback:', err?.message);
    return FALLBACK_TEMPLATES_UI;
  }
}
