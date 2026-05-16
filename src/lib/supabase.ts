import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || 'placeholder_key';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.error('❌ Supabase env vars missing! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Render dashboard');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase client initialized with URL:', supabaseUrl);
