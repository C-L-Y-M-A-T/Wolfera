import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'src/config';

@Injectable()
export class SupabaseService {
  private readonly supabaseUrl = config.supabase.url;
  private readonly anonKey = config.supabase.anonKey;
  private readonly serviceRoleKey = config.supabase.roleKey;

  get admin(): SupabaseClient {
    return createClient(this.supabaseUrl, this.serviceRoleKey);
  }

  get client(): SupabaseClient {
    return createClient(this.supabaseUrl, this.anonKey);
  }
}
