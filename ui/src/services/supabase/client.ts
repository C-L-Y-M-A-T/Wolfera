import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const getSupabaseFrontendClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
