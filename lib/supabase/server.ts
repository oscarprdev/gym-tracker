import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export type SupabaseAdmin = typeof supabaseAdmin;
