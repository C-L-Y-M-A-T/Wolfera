type DatabaseConfig = {
  user: string;
  password: string;
  dbName: string;
  host: string;
  port: number;
  uri?: string;
};

type JwtConfig = {
  secret: string;
  expirationTime: string;
};

export type Config = {
  apiHost: string;
  apiPort: number;
  apiBaseUrl: string;

  uiHost: string;
  uiPort: number;
  uiBaseUrl: string;

  corsOrigin: string[];

  postgres: DatabaseConfig;

  jwt: JwtConfig;

  env: string;
};
