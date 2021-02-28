import 'reflect-metadata';
import DNAService from '../../src/service/dna/dnaService';
import DNAServiceImpl from '../../src/service/dna/dnaServiceImpl';
import { Forbidden } from '../../src/util/exception';
import DNATestBuilder from '../util/dnaTestBuilder';

describe('DNAService', () => {

    const dnaService: DNAService = new DNAServiceImpl();

    describe('validateDNA', () => {
        it('should throw Forbidden if dna is not a array', () => {
            const dna: any = '';
            expect(() => dnaService.validateDNA(dna)).toThrow(Forbidden);
            expect(() => dnaService.validateDNA(dna)).toThrow('Invalid DNA');
        });

        it('should throw Forbidden if dna array is empty', () => {
            const dna = DNATestBuilder.newDNA().withEmptyData().build();
            expect(() => dnaService.validateDNA(dna)).toThrow(Forbidden);
            expect(() => dnaService.validateDNA(dna)).toThrow('Invalid DNA');
        });

        it('should throw Forbidden if dna array length is less than 4', () => {
            const dna = DNATestBuilder.newDNA().withRandomValidDNA(3).build();
            expect(() => dnaService.validateDNA(dna)).toThrow(Forbidden);
            expect(() => dnaService.validateDNA(dna)).toThrow('Invalid DNA');
        });

        it('should throw Forbidden if dna array isnt square', () => {
            const dna = DNATestBuilder.newDNA().withRandomValidRow(3)
                .withRandomValidRow(3).withRandomValidRow(3).withRandomValidRow(3).build();
            expect(() => dnaService.validateDNA(dna)).toThrow(Forbidden);
            expect(() => dnaService.validateDNA(dna)).toThrow('DNA data isnt NxN');
        });

        it('should throw Forbidden if dna array have all invalid chars', () => {
            const dna = DNATestBuilder.newDNA().withRandomInvalidDNA(4).build();
            expect(() => dnaService.validateDNA(dna)).toThrow(Forbidden);
            expect(() => dnaService.validateDNA(dna)).toThrow('DNA data contains invalid characters');
        });

        it('should throw Forbidden if dna array have lower case valid chars', () => {
            const dna = DNATestBuilder.newDNA().withRandomValidRow(4).withRandomValidRow(4)
                .withRandomValidRow(4).withRow('atcg').build();
            expect(() => dnaService.validateDNA(dna)).toThrow(Forbidden);
            expect(() => dnaService.validateDNA(dna)).toThrow('DNA data contains invalid characters');
        });

        it('should throw Forbidden if dna array have at least 1 invalid char', () => {
            const dna = DNATestBuilder.newDNA().withRandomValidRow(4).withRandomValidRow(4)
                .withRandomValidRow(4).withRow('AGCD').build();
            expect(() => dnaService.validateDNA(dna)).toThrow(Forbidden);
            expect(() => dnaService.validateDNA(dna)).toThrow('DNA data contains invalid characters');
        });

        it('should be ok with valid DNA', () => {
            const dna = DNATestBuilder.newDNA().withRandomValidDNA(4).build();
            dnaService.validateDNA(dna);
        });
    });

    describe('isMutant', () => {
        it('should throw Forbidden if dna array is not from mutant', () => {
            const dna = DNATestBuilder.newDNA().withRow('ATCG').withRow('CAGT').withRow('TTAT')
                .withRow('AGAC').build();
            expect(() => dnaService.isMutant(dna)).toThrow(Forbidden);
            expect(() => dnaService.isMutant(dna)).toThrow('DNA isnt from a mutant');
        });

        it('should throw Forbidden if dna array only have 1 valid secuence', () => {
            const dna = DNATestBuilder.newDNA().withRow('ATCG').withRow('ATGC').withRow('ATGC')
                .withRow('AGCT').build();
            expect(() => dnaService.isMutant(dna)).toThrow(Forbidden);
            expect(() => dnaService.isMutant(dna)).toThrow('DNA isnt from a mutant');
        });

        it('should pass with intersected valid DNA', () => {
            const dna = DNATestBuilder.newDNA().withRow('ATATA').withRow('TAAAT').withRow('AAAAA')
                .withRow('TAAAT').withRow('ATATA').build();
            const result = dnaService.isMutant(dna);
            expect(result).toBeTruthy();
        });

        it('should pass with an valid DNA', () => {            
            const dna = DNATestBuilder.newDNA().withRow('ATGCGA').withRow('CAGTGC').withRow('TTATGT')
                .withRow('AGAAGG').withRow('CCCCTA').withRow('TCACTG').build();
            const result = dnaService.isMutant(dna);
            expect(result).toBeTruthy();
        })
    });

});