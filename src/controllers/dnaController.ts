import { Application, NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { dataResponse, isMutantResponse } from '../util/response';
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
                    this.dnaService.validateDNA(dna);
                    const dnaRegistered = await this.dnaService.findDNA(dna);
                    const isMutant = await this.dnaService.processDNA(dnaRegistered, dna);
                    return isMutantResponse(res, isMutant);
                } catch (error) {
                    return next(error);
                }
            });

        app.route('/stats/')
            .get(async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result = await this.dnaService.getStats();
                    return dataResponse(res, result);
                } catch (error) {
                    return next(error);
                }
            });

    }

}