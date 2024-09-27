
import dotenv from 'dotenv';

dotenv.config();

export function getEnvironmentVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const PORT = parseInt(getEnvironmentVariable('PORT'), 10);
export const NODE_ENV = getEnvironmentVariable('NODE_ENV');
export const IS_PRODUCTION = NODE_ENV === 'production';