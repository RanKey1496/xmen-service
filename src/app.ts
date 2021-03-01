import express, { Application, Request, Response, NextFunction } from 'express';
import { RegistrableController } from './controllers/registrableController';
import { container } from './config/inversify';
import { forbiddenResponse, internalResponse } from './util/response';
import { Forbidden } from './util/exception';
import { createConnection } from 'typeorm';
import { options } from './config/db';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import cors from 'cors';
import Types from './config/types';

export default class App {

    constructor() {
        this.start();
    }

    private async init() {
        await createConnection(options);

        const app: Application = express();
        app.set('port', process.env.PORT || 3000);
        app.use(compression());
        app.use(helmet());
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(morgan('common'));
        if (process.env.NODE_ENV === 'development') app.use(errorHandler());

        const controllers: RegistrableController[] = container.getAll<RegistrableController>(Types.Controller);
        controllers.forEach(controller => controller.register(app));

        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof Forbidden) {
                return forbiddenResponse(res, err.message);
            }
            return internalResponse(res);
        });
        return app;
    }

    public async start() {
        const app = await this.init();
        const server = app.listen(app.get('port'), async () => {
            console.log(`Service running at port ${app.get('port')} in ${app.get('env')} mode`);
            console.log('Starting date:', new Date());
        });
        return server;
    }

}