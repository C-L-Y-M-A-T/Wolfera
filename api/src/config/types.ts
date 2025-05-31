type DatabaseConfig = {
  user: string;
  password: string;
  dbName: string;
  host: string;
  port: number;
  uri?: string;
};

export type Config = {
  apiHost: string;
  apiPort: number;
  apiBaseUrl: string;

  uiHost: string;
  uiPort: number;
  uiBaseUrl: string;

  postgres: DatabaseConfig;
  env: string;
};
