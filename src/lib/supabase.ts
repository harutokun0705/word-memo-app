import { createClient } from '@supabase/supabase-js';
import { createMockSupabaseClient } from './mockSupabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isMock = !supabaseUrl || !supabaseAnonKey;

if (isMock) {
  console.warn('⚠️ Supabase credentials not found. Using MOCK authentication for local development.');
}

export const supabase = isMock
  ? createMockSupabaseClient() as any // Cast to any to bypass strict type matching for mock
  : createClient(supabaseUrl!, supabaseAnonKey!);

