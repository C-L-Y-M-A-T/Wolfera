import * as dotenv from 'dotenv';
import { Config } from './types';

dotenv.config({ path: process.cwd() + '/../.env' });

export const config: Config = {
  apiHost: process.env.API_HOST || 'localhost',
  apiPort: parseInt(process.env.API_PORT || '3000'),
  apiBaseUrl:
    process.env.API_BASE_URL ||
    `http://${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || '3000'}` ||
    'http://localhost:3000',

  uiHost: process.env.UI_HOST || 'localhost',
  uiPort: parseInt(process.env.UI_PORT || '3000'),
  uiBaseUrl:
    process.env.UI_BASE_URL ||
    `http://${process.env.UI_HOST || 'localhost'}:${process.env.UI_PORT || '3000'}` ||
    'http://localhost:3000',

  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000'],

  dbType: (process.env.DB_TYPE as 'postgres' | 'mysql') || 'postgres',

  db: {
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
    dbName: process.env.POSTGRES_DB || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret',
    expirationTime: process.env.JWT_EXPIRATION_TIME || '1h',
  },

  env: process.env.ENV || 'development',
};
