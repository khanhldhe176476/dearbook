import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase env vars missing:', { supabaseUrl, supabaseAnonKey });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'implicit',
    persistSession: true,
    detectSessionInUrl: true,
  }
});

console.log('✅ Supabase client initialized with URL:', supabaseUrl);
