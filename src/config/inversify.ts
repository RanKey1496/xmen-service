import { Container } from 'inversify';
import { DNARepository } from '../repository/dnaRepository';
import { DNAController } from '../controllers/dnaController';
import { RegistrableController } from '../controllers/registrableController';
import DNAService from '../service/dna/dnaService';
import DNAServiceImpl from '../service/dna/dnaServiceImpl';
import Types from './types';

const container: Container = new Container();

container.bind<RegistrableController>(Types.Controller).to(DNAController);

container.bind<DNAService>(Types.DNAService).to(DNAServiceImpl);

container.bind<DNARepository>(Types.DNARepository).to(DNARepository);

export { container };