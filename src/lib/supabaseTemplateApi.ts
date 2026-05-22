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

/** Dữ liệu mẫu fallback khi Supabase lỗi permission */
const FALLBACK_TEMPLATES_UI: BookTemplateUI[] = [
  { id: 'template-love-1', title: 'Tình Yêu Mãi Mãi', description: 'Mẫu sách lãng mạn dành cho các cặp đôi.', coverImageUrl: '', price: 299000 },
  { id: 'template-family-1', title: 'Ký Ức Gia Đình', description: 'Cuốn sách ảnh gia đình ấm áp.', coverImageUrl: '', price: 349000 },
  { id: 'template-birthday-1', title: 'Sinh Nhật Đặc Biệt', description: 'Tặng người thân món quà ý nghĩa.', coverImageUrl: '', price: 249000 },
  { id: 'template-wedding-1', title: 'Ngày Cưới Hạnh Phúc', description: 'Album cưới cao cấp.', coverImageUrl: '', price: 499000 },
  { id: 'template-travel-1', title: 'Hành Trình Khám Phá', description: 'Ghi lại những chuyến du lịch đáng nhớ.', coverImageUrl: '', price: 299000 },
  { id: 'template-kids-1', title: 'Tuổi Thơ Tươi Đẹp', description: 'Sách ảnh dành cho bé.', coverImageUrl: '', price: 279000 },
];

/** Lấy tất cả template đang active (is_active = true) */
export async function fetchActiveBookTemplates(): Promise<BookTemplateUI[]> {
  try {
    const { data, error } = await supabase
      .from('book_templates')
      .select('id, name, description, cover_image_url, price, is_active, category_id')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('⚠️ fetchActiveBookTemplates error – dùng fallback:', error.message);
      return FALLBACK_TEMPLATES_UI;
    }

    console.log('📦 Supabase book_templates raw data:', data);

    if (!data || data.length === 0) {
      console.warn('⚠️ Không có dữ liệu từ Supabase – dùng fallback templates.');
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

    console.log('✅ Mapped BookTemplateUI[]:', mapped);
    return mapped;
  } catch (err: any) {
    console.warn('⚠️ fetchActiveBookTemplates exception – dùng fallback:', err?.message);
    return FALLBACK_TEMPLATES_UI;
  }
}
