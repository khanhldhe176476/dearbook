import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase env vars missing: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined!');
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'implicit',
        persistSession: true,
        detectSessionInUrl: true,
      }
    })
  : null as any;

console.log('✅ Supabase client initialized status:', !!supabase);
