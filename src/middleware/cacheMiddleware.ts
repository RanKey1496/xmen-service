import { NextFunction, Request, Response } from 'express';
import { createClient, RedisClient } from 'redis';
import { cacheOptions } from '../config/db';

const redisClient: RedisClient = createClient(cacheOptions);

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

export function saveCacheData(req: Request, data: any) {
    const cacheKey = `__expIress__${req.originalUrl || req.url}`;
    redisClient.setex(cacheKey, 30, JSON.stringify(data));
}