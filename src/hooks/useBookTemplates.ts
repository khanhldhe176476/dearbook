import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Kiểu dữ liệu map từ bảng book_templates trong Supabase
 */
export interface BookTemplate {
  id: string;
  /** Tên hiển thị của mẫu sách */
  name: string;
  /** Mô tả ngắn */
  description: string | null;
  /** URL ảnh bìa */
  cover_image_url: string | null;
  /** Giá (VNĐ) */
  price: number | null;
  /** Chỉ hiển thị template đang active */
  is_active: boolean;
  /** Các trường phụ có thể có */
  theme?: string | null;
  badge?: string | null;
  page_count?: number | null;
}

interface UseBookTemplatesResult {
  templates: BookTemplate[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBookTemplates(): UseBookTemplatesResult {
  const [templates, setTemplates] = useState<BookTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📡 Fetching book_templates from Supabase...');

      const { data, error: sbError } = await supabase
        .from('book_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (sbError) {
        throw sbError;
      }

      console.log('✅ book_templates data from Supabase:', data);
      // Nếu Supabase trả về mảng rỗng, dùng fallback
      setTemplates(data && data.length > 0 ? data : FALLBACK_TEMPLATES);
    } catch (err: any) {
      console.error('❌ Error fetching book_templates:', err);
      // Nếu lỗi permission (RLS chưa được cấu hình), dùng fallback data
      if (
        err?.code === '42501' ||
        err?.message?.includes('permission denied') ||
        err?.message?.includes('row-level security')
      ) {
        console.warn('⚠️ RLS permission error – sử dụng dữ liệu mẫu tạm thời.');
        setTemplates(FALLBACK_TEMPLATES);
        setError(null);
      } else {
        // Lỗi khác cũng dùng fallback để UI không bị trắng
        console.warn('⚠️ Lỗi Supabase – dùng dữ liệu mẫu:', err?.message);
        setTemplates(FALLBACK_TEMPLATES);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, loading, error, refetch: fetchTemplates };
}

/** Dữ liệu mẫu dùng khi Supabase chưa cấu hình RLS policy */
const FALLBACK_TEMPLATES: BookTemplate[] = [
  {
    id: 'template-love-1',
    name: 'Tình Yêu Mãi Mãi',
    description: 'Mẫu sách lãng mạn dành cho các cặp đôi, lưu giữ những kỷ niệm đẹp nhất.',
    cover_image_url: null,
    price: 299000,
    is_active: true,
    theme: 'romantic',
    badge: 'Phổ biến',
    page_count: 20,
  },
  {
    id: 'template-family-1',
    name: 'Ký Ức Gia Đình',
    description: 'Cuốn sách ảnh gia đình ấm áp, ghi lại những khoảnh khắc quý giá bên nhau.',
    cover_image_url: null,
    price: 349000,
    is_active: true,
    theme: 'family',
    badge: 'Mới',
    page_count: 24,
  },
  {
    id: 'template-birthday-1',
    name: 'Sinh Nhật Đặc Biệt',
    description: 'Tặng người thân món quà ý nghĩa nhân ngày sinh nhật với những lời chúc yêu thương.',
    cover_image_url: null,
    price: 249000,
    is_active: true,
    theme: 'birthday',
    badge: 'Hot',
    page_count: 16,
  },
  {
    id: 'template-travel-1',
    name: 'Hành Trình Khám Phá',
    description: 'Ghi lại những chuyến du lịch đáng nhớ với bạn bè và gia đình.',
    cover_image_url: null,
    price: 299000,
    is_active: true,
    theme: 'travel',
    badge: null,
    page_count: 20,
  },
  {
    id: 'template-wedding-1',
    name: 'Ngày Cưới Hạnh Phúc',
    description: 'Album cưới cao cấp lưu giữ những khoảnh khắc thiêng liêng nhất trong cuộc đời.',
    cover_image_url: null,
    price: 499000,
    is_active: true,
    theme: 'wedding',
    badge: 'Premium',
    page_count: 32,
  },
  {
    id: 'template-kids-1',
    name: 'Tuổi Thơ Tươi Đẹp',
    description: 'Sách ảnh dành cho bé, ghi lại từng bước trưởng thành đáng yêu.',
    cover_image_url: null,
    price: 279000,
    is_active: true,
    theme: 'kids',
    badge: null,
    page_count: 20,
  },
];
