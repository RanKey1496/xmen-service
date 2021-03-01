import { DNAEntity } from '../entity/dnaEntity';
import { ConnectionOptions } from 'typeorm';
import { ClientOpts } from 'redis';

export const dbOptions: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'wolverine',
    password: process.env.DB_PASSWORD || 'logan',
    database: process.env.DB_NAME || 'xmendb',
    entities: [
        DNAEntity
    ],
    logging: process.env.DB_LOGGING ? true : false,
    synchronize: true
};

export const cacheOptions: ClientOpts = {
    host: process.env.CACHE_HOST || 'localhost',
    port: Number(process.env.CACHE_PORT) || 6379,
    password: process.env.CACHE_PASSWORD || 'quicksilver'
};