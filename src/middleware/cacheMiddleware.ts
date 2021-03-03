import { NextFunction, Request, Response } from 'express';
import { createClient, RedisClient } from 'redis';
import { cacheOptions } from '../config/db';

const redisClient: RedisClient = createClient(cacheOptions);

/**
 * Este middleware me permite obtener los datos de una instancia de Redis que han
 * sido guardados anteriormente y poder retornarlos para disminuir el tiempo de
 * respuesta de ciertos endpoints
 * @param req Request de Express
 * @param res Response de Express
 * @param next Funcion next de express
 */
export function checkCacheData(req: Request, res: Response, next: NextFunction) {
    const cacheKey = `__expIress__${req.originalUrl || req.url}`;
    redisClient.get(cacheKey, (err, data) => {
        if (err) {
            next();
        }
        if (data) {
            const response = JSON.parse(data);
            return res.status(200).json(response);
        }
        next();
    });
}

/**
 * Esta funcion permite guardar en una instancia de Redis la información
 * que se le ha respondido al usuario para en próximas peticiones, disminuir
 * el tiempo de respuesta
 * @param req Request de Express
 * @param data Datos a guardar
 */
export function saveCacheData(req: Request, data: any) {
    const cacheKey = `__expIress__${req.originalUrl || req.url}`;
    redisClient.setex(cacheKey, 30, JSON.stringify(data));
}