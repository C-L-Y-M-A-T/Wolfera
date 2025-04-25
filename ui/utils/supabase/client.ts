// utils/supabaseClient.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const supabase = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(async ({ name, value, options }) => {
            (await cookies()).set(name, value, options);
          });
        },
      },
    }
  );
