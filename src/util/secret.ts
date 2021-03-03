import dotenv from 'dotenv';
import fs from 'fs';

export const ENVIRONMENT = process.env.NODE_ENV;

/**
 * Si nos encontramos en producción, cargamos el archivo .env, en caso contrario .env.dev
 */
if (ENVIRONMENT === 'production') {
  if (fs.existsSync('.env')) {
    console.info('Using production environment variables');
    dotenv.config({ path: '.env' });
  } else {
    console.error('Cant load production .env variables');
    process.exit(1);
  }
} else {
  if (fs.existsSync('.env.dev')) {
    console.info('Using development environment variables');
    dotenv.config({ path: '.env.dev' });
  } else {
      console.error('Cant load development .env.dev variables');
      process.exit(1);
  }
}