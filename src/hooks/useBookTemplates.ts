import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Kiu d liu map t bng book_templates trong Supabase
 */
export interface BookTemplate {
  id: string;
  /** Tn hin th ca mu sch */
  name: string;
  /** M t ngn */
  description: string | null;
  /** URL nh ba */
  cover_image_url: string | null;
  /** Gi (VN) */
  price: number | null;
  /** Ch hin th template ang active */
  is_active: boolean;
  /** Cc trng ph c th c */
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
      console.log(' Fetching book_templates from Supabase...');

      const { data, error: sbError } = await supabase
        .from('book_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (sbError) {
        throw sbError;
      }

      console.log(' book_templates data from Supabase:', data);
      // Nu Supabase tr v mng rng, dng fallback
      setTemplates(data && data.length > 0 ? data : FALLBACK_TEMPLATES);
    } catch (err: any) {
      console.error(' Error fetching book_templates:', err);
      // Nu li permission (RLS cha c cu hnh), dng fallback data
      if (
        err?.code === '42501' ||
        err?.message?.includes('permission denied') ||
        err?.message?.includes('row-level security')
      ) {
        console.warn(' RLS permission error  s dng d liu mu tm thi.');
        setTemplates(FALLBACK_TEMPLATES);
        setError(null);
      } else {
        // Li khc cng dng fallback  UI khng b trng
        console.warn(' Li Supabase  dng d liu mu:', err?.message);
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

/** D liu mu dng khi Supabase cha cu hnh RLS policy */
const FALLBACK_TEMPLATES: BookTemplate[] = [
  {
    id: 'template-love-1',
    name: 'Tnh Yu Mi Mi',
    description: 'Mu sch lng mn dnh cho cc cp i, lu gi nhng k nim p nht.',
    cover_image_url: '/tinh-yeu/firrst-love/aa.png',
    price: 299000,
    is_active: true,
    theme: 'romantic',
    badge: 'Ph bin',
    page_count: 20,
  },
  {
    id: 'template-family-1',
    name: 'K c Gia nh',
    description: 'Cun sch nh gia nh m p, ghi li nhng khonh khc qu gi bn nhau.',
    cover_image_url: '/ca-nhan/dust-soul/aa.png',
    price: 349000,
    is_active: true,
    theme: 'family',
    badge: 'Mi',
    page_count: 24,
  },
  {
    id: 'template-birthday-1',
    name: 'Sinh Nht c Bit',
    description: 'Tng ngi thn mn qu  ngha nhn ngy sinh nht vi nhng li chc yu thng.',
    cover_image_url: '/ca-nhan/dust-soul/aatbio_com_image_export_May_23_2026%20(1).png',
    price: 249000,
    is_active: true,
    theme: 'birthday',
    badge: 'Hot',
    page_count: 16,
  },
  {
    id: 'template-travel-1',
    name: 'Hnh Trnh Khm Ph',
    description: 'Ghi li nhng chuyn du lch ng nh vi bn b v gia nh.',
    cover_image_url: '/ban-be/vintage-style/aatbio_com_image_export_May_21_2026%20(1).png',
    price: 299000,
    is_active: true,
    theme: 'travel',
    badge: null,
    page_count: 20,
  },
  {
    id: 'template-wedding-1',
    name: 'Ngy Ci Hnh Phc',
    description: 'Album ci cao cp lu gi nhng khonh khc thing ling nht trong cuc i.',
    cover_image_url: '/tinh-yeu/firrst-love/aatbio_com_image_export_May_31_2026%20(1).png',
    price: 499000,
    is_active: true,
    theme: 'wedding',
    badge: 'Premium',
    page_count: 32,
  },
  {
    id: 'template-kids-1',
    name: 'Tui Th Ti p',
    description: 'Sch nh dnh cho b, ghi li tng bc trng thnh ng yu.',
    cover_image_url: '/ban-be/xanh-la-khong-xa-lanh/aa.png',
    price: 279000,
    is_active: true,
    theme: 'kids',
    badge: null,
    page_count: 20,
  },
];
