import dotenv from 'dotenv';

dotenv.config();

export const config = {
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'productos',
  dbPort: parseInt(process.env.DB_PORT || '3306'),
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
