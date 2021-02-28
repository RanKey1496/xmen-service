export default interface DNAService {
    validateDNA(dna: Array<string>): void;
    isMutant(dna: Array<string>): void;
}