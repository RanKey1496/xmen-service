import { DNAEntity } from '../../entity/dnaEntity';

export default interface DNAService {
    validateDNA(dna: Array<string>): void;
    isMutant(dna: Array<string>): boolean;
    findDNA(dna: Array<string>): Promise<DNAEntity>;
    processDNA(dnaRegistered: DNAEntity, dna: Array<string>): Promise<boolean>;
    getStats(): Promise<{count_mutant_dna: number, count_human_dna: number, ratio: number}>;
}