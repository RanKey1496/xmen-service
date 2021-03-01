import { DNAEntity } from '../entity/dnaEntity';
import { ConnectionOptions } from 'typeorm';

export const options: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        DNAEntity
    ],
    logging: process.env.DB_LOGGING ? true : false
};