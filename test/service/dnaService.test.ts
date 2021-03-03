import 'reflect-metadata';
import { DNARepository } from '../../src/repository/dnaRepository';
import DNAService from '../../src/service/dna/dnaService';
import DNAServiceImpl from '../../src/service/dna/dnaServiceImpl';
import { Forbidden } from '../../src/util/exception';
import DNATestBuilder from '../util/dnaTestBuilder';
import { mock, instance, when, anything } from 'ts-mockito';
import { DNAEntity } from '../../src/entity/dnaEntity';

describe('DNAService', () => {

    let dnaService: DNAService;
    let dnaRepository: DNARepository;

    beforeAll(async done => {
        dnaRepository = mock(DNARepository);
        dnaService = new DNAServiceImpl(instance(dnaRepository));
        done();
    });

    describe('validateDNA', () => {
        it('should throw Forbidden if dna length is less than 4', () => {
            const dna: any = ['','',''];
            expect(() => dnaService.validateDNA(dna)).toThrow(Forbidden);
            expect(() => dnaService.validateDNA(dna)).toThrow('Invalid DNA');
        });

        it('should throw Forbidden if dna is not a array', () => {
            const dna: any = 'abcde';
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

        it('should throw Forbidden if dna array at least 1 invalid row', () => {
            const dna = DNATestBuilder.newDNA().withRandomValidRow(4).withRandomValidRow(4)
                .withRandomValidRow(4).withRandomInvalidRow(4).build();
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

        it('should throw Forbidden if dna have invalid values', () => {
            const dna = DNATestBuilder.newDNA().withInvalidValues().build();
            expect(() => dnaService.validateDNA(dna)).toThrow(Forbidden);
            expect(() => dnaService.validateDNA(dna)).toThrow('DNA data contains invalid characters');
        });

        it('should be ok with valid DNA', () => {
            const dna = DNATestBuilder.newDNA().withValidValues().build();
            dnaService.validateDNA(dna);
        });
    });

    describe('isMutant', () => {
        it('should return false if dna array is not from mutant', () => {
            const dna = DNATestBuilder.newDNA().withRow('ATCG').withRow('CAGT').withRow('TTAT')
                .withRow('AGAC').build();
            const result = dnaService.isMutant(dna);
            expect(result).toBeFalsy();
        });

        it('should return false if dna array only have 1 valid secuence', () => {
            const dna = DNATestBuilder.newDNA().withRow('ATCG').withRow('ATGC').withRow('ATGC')
                .withRow('AGCT').build();
            const result = dnaService.isMutant(dna);
            expect(result).toBeFalsy();
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

    describe('findDNA', () => {
        it('should return undefined if value doesnt exists', async () => {
            const dna = DNATestBuilder.newDNA().withRandomValidDNA(4).build();
            const flatDNA = dna.join();
            when(dnaRepository.findByValue(flatDNA)).thenResolve(undefined);
            const result = await dnaService.findDNA(dna);
            expect(result).toBeUndefined();
        });

        it('should return true if dna exists and is mutant', async () => {
            const dna = DNATestBuilder.newDNA().withRandomValidDNA(4).build();
            const flatDNA = dna.join();
            when(dnaRepository.findByValue(flatDNA)).thenResolve(new DNAEntity(flatDNA, true));
            const result = await dnaService.findDNA(dna);
            expect(result.isMutant).toBeTruthy();
        });

        it('should return false if dna exists and is human', async () => {
            const dna = DNATestBuilder.newDNA().withRandomValidDNA(4).build();
            const flatDNA = dna.join();
            when(dnaRepository.findByValue(flatDNA)).thenResolve(new DNAEntity(flatDNA, false));
            const result = await dnaService.findDNA(dna);
            expect(result.isMutant).toBeFalsy();
        });
    });

    describe('processDNA', () => {
        it('should return false if dna registered previously and is human', async () => {
            const dna = DNATestBuilder.newDNA().withRandomValidDNA(4).build();
            const dnaRegistered = new DNAEntity(dna.join(), false);
            const result = await dnaService.processDNA(dnaRegistered, dna);
            expect(result).toBeFalsy();
        });

        it('should return true if dna registered previously and is mutant', async () => {
            const dna = DNATestBuilder.newDNA().withRandomValidDNA(4).build();
            const dnaRegistered = new DNAEntity(dna.join(), true);
            const result = await dnaService.processDNA(dnaRegistered, dna);
            expect(result).toBeTruthy();
        });

        it('should return true if dna is from mutant', async () => {
            const dna = DNATestBuilder.newDNA().withRow('ATATA').withRow('TAAAT').withRow('AAAAA')
                .withRow('TAAAT').withRow('ATATA').build();
            when(dnaRepository.save(anything())).thenResolve();
            const result = await dnaService.processDNA(undefined, dna);
            expect(result).toBeTruthy();
        });

        it('should return false if dna is from human', async () => {
            const dna = DNATestBuilder.newDNA().withRow('ATCG').withRow('ATGC').withRow('ATGC')
                .withRow('AGCT').build();
            when(dnaRepository.save(anything())).thenResolve();
            const result = await dnaService.processDNA(undefined, dna);
            expect(result).toBeFalsy();
        });
    });

    describe('getStats', () => {
        it('should return zero content if no values found', async () => {
            const response = { count_mutant_dna: 0, count_human_dna: 0, ratio: 0 };
            when(dnaRepository.findStats()).thenResolve(undefined);
            const result = await dnaService.getStats();
            expect(result).toEqual(response);
        });

        it('should return ratio greather than 1', async () => {
            const stats = { mutants: 400, humans: 100 };
            const response = { count_mutant_dna: 400, count_human_dna: 100, ratio: 4 };
            when(dnaRepository.findStats()).thenResolve(stats);
            const result = await dnaService.getStats();
            expect(result).toEqual(response);
        });

        it('should return ok with results', async () => {
            const stats = { mutants: 40, humans: 100 };
            const response = { count_mutant_dna: 40, count_human_dna: 100, ratio: 0.4 };
            when(dnaRepository.findStats()).thenResolve(stats);
            const result = await dnaService.getStats();
            expect(result).toEqual(response);
        });
    });

});