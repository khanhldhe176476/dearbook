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
      setTemplates(data ?? []);
    } catch (err: any) {
      console.error('❌ Error fetching book_templates:', err);
      setError(err?.message || 'Không thể tải dữ liệu từ Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, loading, error, refetch: fetchTemplates };
}
