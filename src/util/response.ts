import { Response } from 'express';

function data(success: boolean, message: string) {
    return {
        success,
        message
    };
}

export function dataResponse(res: Response, data: any) {
    return res.status(200).json({ success: true, data });
}

export function forbiddenResponse(res: Response, message: string) {
    return res.status(403).json(data(false, message));
}

export function internalResponse(res: Response) {
    return res.status(500).json(data(false, 'Internal server error, try again later'));
}