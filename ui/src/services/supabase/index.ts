import { getSupabaseFrontendClient } from "@/services/supabase/client";

export async function signInWithEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  const supabase = await getSupabaseFrontendClient();
  const result = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  return result;
}

export async function signUpWithEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  const supabase = await getSupabaseFrontendClient();
  const result = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.UI_BASE_URL}/auth`,
    },
  });

  console.log("Sign up result:", result);

  return result;
}
