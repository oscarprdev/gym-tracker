import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/config/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export type SupabaseClient = typeof supabase;
