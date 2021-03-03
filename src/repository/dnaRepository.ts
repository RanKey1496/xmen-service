import { injectable } from 'inversify';
import { getRepository, Repository } from 'typeorm';
import { DNAEntity } from '../entity/dnaEntity';

@injectable()
export class DNARepository {

    private dnaRepository: Repository<DNAEntity>;

    constructor() {
        this.dnaRepository = getRepository(DNAEntity);
    }

    /**
     * Guarda en la BD un registro
     * @param data DNA Entity
     */
    public async save(data: DNAEntity): Promise<DNAEntity> {
        return await this.dnaRepository.save(data);
    }

    /**
     * Busca en la base de datos un ADN ya registrado
     * @param dna DNA string
     */
    public async findByValue(dna: string): Promise<DNAEntity> {
        return await this.dnaRepository.findOne({ value: dna });
    }

    /**
     * Retorna la cantidad de mutantes y humanos registrados en la base de datos
     * Basicamente realiza un COUNT a la tabla que posteriormente se filtrará por
     * el valor booleano isMutant para contar la totalidad de cada raza
     */
    public async findStats(): Promise<{ mutants: number, humans: number}> {
        return await this.dnaRepository.createQueryBuilder('dna')
            .select(['COUNT(*) FILTER (WHERE dna.isMutant) AS mutants',
                    'COUNT(*) FILTER (WHERE NOT dna.isMutant) AS humans'])
            .getRawOne();
    }

}