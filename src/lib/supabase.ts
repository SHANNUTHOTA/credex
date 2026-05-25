import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isValidUrl = (value: string | undefined) => {
  if (!value) return false;
  return /^https?:\/\//.test(value);
};

export const supabase =
  isValidUrl(supabaseUrl) &&
  typeof supabaseAnonKey === "string" &&
  supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY" &&
  !supabaseAnonKey.startsWith("YOUR_")
    ? createClient(supabaseUrl as string, supabaseAnonKey)
    : null;
