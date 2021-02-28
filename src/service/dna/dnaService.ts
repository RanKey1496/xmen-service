export default interface DNAService {
    validateDNA(dna: Array<string>): Promise<void>;
    isMutant(dna: Array<string>): Promise<void>;
}