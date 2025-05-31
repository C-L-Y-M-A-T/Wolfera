type DatabaseConfig = {
  user: string;
  password: string;
  dbName: string;
  host: string;
  port: number;
  uri?: string;
};

type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
  jwtSecret: string;
};

export type Config = {
  apiHost: string;
  apiPort: number;
  apiBaseUrl: string;

  uiHost: string;
  uiPort: number;
  uiBaseUrl: string;

  corsOrigin: string;

  dbType: 'postgres' | 'mysql';

  db: DatabaseConfig;

  supabase: SupabaseConfig;

  env: string;
};
