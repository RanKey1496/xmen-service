import { Application, NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { dataResponse } from '../util/response';
import { RegistrableController } from './registrableController';
import Types from '../config/types';
import DNAService from '../service/dna/dnaService';

@injectable()
export class DNAController implements RegistrableController {

    @inject(Types.DNAService)
    private dnaService: DNAService;

    public register(app: Application): void {

        app.route('/mutant/')
            .post(async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const dna = req.body.dna;
                    await this.dnaService.validateDNA(dna);
                    return dataResponse(res, dna);
                } catch (error) {
                    return next(error);
                }
            });

    }

}