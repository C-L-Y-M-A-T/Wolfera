import { createClient } from '@supabase/supabase-js';
import { config } from 'src/config';

export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
);
