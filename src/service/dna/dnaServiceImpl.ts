import { injectable, inject } from 'inversify';
import { isSetsEqual } from '../../util/main';
import { Forbidden } from '../../util/exception';
import { DNARepository } from '../../repository/dnaRepository';
import { DNAEntity } from '../../entity/dnaEntity';
import DNAService from './dnaService';
import Types from '../../config/types';

@injectable()
export default class DNAServiceImpl implements DNAService {

    constructor(@inject(Types.DNARepository) private dnaRepository: DNARepository) {}

    /**
     * Valida si un parametro si es un Array
     * @param dna DNA Array
     */
    private isArrayOrInvalidLength(dna: Array<string>): void {
        if (dna?.length < 4 || !Array.isArray(dna)) throw new Forbidden('Invalid DNA');
    }

    /**
     * Valida si la data si es NxN
     * @param dna DNA Array
     */
    private isSquare(dna: Array<string>): void {
        const isSameLength = dna.every((value, i, array) => value.length === array.length);
        if (!isSameLength) throw new Forbidden('DNA data isnt NxN');
    }

    /**
     * Valida que la data contenga solo caracteres validos
     * @param dna DNA Array
     */
    private lettersAreValid(dna: Array<string>): void {
        const valid = dna.every((value, i, array) => /^[ACGT]+$/.test(value));
        if (!valid) throw new Forbidden('DNA data contains invalid characters');
    }

    /**
     * Agrega un valor al set de posiciones
     * @param positions Set de posiciones
     * @param x Numero de fila que está iterando sobre el DNA Array
     * @param y Numero de columna que está iterando sobre el DNA Array
     */
    private addCoordinates(positions: Set<string>, x: number, y: number): void {
        positions.add(`${x},${y}`);
    }

    /**
     * Función recursiva que permite iterar sobre una palabra.
     * Durante su ejecución intentará de acuerdo a una coordenada de la letra que está
     * en el DNA Array, realizar una busqueda utilizando un algoritmo de "backtracking".
     * Este algoritmo nos permite realizar una busqueda depth-first y en caso de no cumplir
     * una condición nos retorna al ultimo punto en el que fue válido
     * @param step Numero del paso que intentará
     * @param x Numero de fila que está iterando sobre el DNA Array
     * @param y Numero de columna que está iterando sobre el DNA Array
     * @param dna DNA Array
     * @param word Palabra que intenta buscar
     * @param positions Coordenadas de la palabra se está buscando
     */
    private iterateOverWord(step: number, dna: Array<string>, x: number, y: number,
        word: string, positions: Set<string>): Set<string> {
            if (word.length == 0) return positions;
            if (step === 1) { x = x; y = y + 1; }
            if (step === 2) { x = x; y = y - 1; }
            if (step === 3) { x = x - 1; y = y; }
            if (step === 4) { x = x + 1; y = y; }
            if (step === 5) { x = x - 1; y = y - 1; }
            if (step === 6) { x = x + 1; y = y - 1; }
            if (step === 7) { x = x - 1; x = x + 1; }
            if (step === 8) { x = x + 1; y = y + 1; }
            try {
                if (dna[x][y] === word[0]) {
                    const newWord = word.substring(1);
                    this.addCoordinates(positions, x, y);
                    const valid = this.iterateOverWord(step, dna, x, y, newWord, positions);
                    if (valid) return positions;
                }
                return undefined;
            } catch {
                return undefined;
            }
    }

    /**
     * Itera sobre los posibles pasos (Steps) de una coordenada del array puede tener,
     * de esta manera nos aseguramos que todas las combinaciones posibles (Horizontal, Vertical y Homogeneas),
     * sean probadas.
     * Probará por cada letra las diferentes combinaciones (Steps) que consisten en:
     * Step 1 - Derecha, Step 2 - Izquierda, Step 3 - Arriba, Step 4 - Abajo
     * Step 5 - Arriba Izquierda, Step 6 - Abajo izquierda
     * Step 7 - Abajo derecha, Step 8 - Abajo derecha
     * @param dna DNA Array
     * @param x Numero de fila que está iterando sobre el DNA Array
     * @param y Numero de columna que está iterando sobre el DNA Array
     * @param word Palabra que intenta buscar
     */
    private coordinatesThroughtSteps(dna: Array<string>, x: number, y: number, word: string): Set<string> {
        const steps = [
            {id: 1, detail: 'right'},
            {id: 2, detail: 'left'},
            {id: 3, detail: 'up'},
            {id: 4, detail: 'down'},
            {id: 5, detail: 'upper left'},
            {id: 6, detail: 'lower left'},
            {id: 7, detail: 'upper right'},
            {id: 8, detail: 'lower right'}
        ];
        const newWord = word.substring(1);
        for (const step of steps) {
            let positions = new Set<string>();
            this.addCoordinates(positions, x, y);
            positions = this.iterateOverWord(step['id'], dna, x, y, newWord, positions);
            if (positions?.size === 4) return positions;
        }
    }

    /**
     * Realiza todas las validaciones que debe tener la data enviada
     * @param dna DNA Array
     */
    public validateDNA(dna: Array<string>): void {
        this.isArrayOrInvalidLength(dna);
        this.isSquare(dna);
        this.lettersAreValid(dna);
    }

    /**
     * Informa si el ADN es de mutante o no
     * @param dna DNA Array
     */
    public isMutant(dna: Array<string>): boolean {
        const coordinates: Array<Set<string>> = [];
        for (let x = 0; x < dna.length; x++) {
            for (let y = 0; y < dna[0].length; y++) {
                const letter = dna[x][y];
                const positions = this.coordinatesThroughtSteps(dna, x, y, `${letter.repeat(4)}`);
                if (positions) {
                    if (coordinates.every((value, index, array) => !isSetsEqual(value, positions))) {
                        coordinates.push(positions);
                    }
                    if (coordinates.length > 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Busca si existe el ADN en nuestra base de datos
     * @param dna DNA String
     */
    public async findDNA(dna: Array<string>): Promise<DNAEntity> {
        const flatDNA = dna.join();
        const result = await this.dnaRepository.findByValue(flatDNA);
        if (!result) return undefined;
        return result;
    }

    /**
     * Confirma si existe un ADN registrado en la DB, si existe, retorna el valor de este
     * En caso contrario, procede a realizar las operaciones para saber si este ADN es de
     * un mutante o de un humano, posterior a esto, guarda la información en la BD y retorna
     * el resultado procesado
     * @param dnaRegistered Registered DNA on database
     * @param dna DNA Array
     */
    public async processDNA(dnaRegistered: DNAEntity, dna: Array<string>): Promise<boolean> {
        if (dnaRegistered !== undefined) return dnaRegistered.isMutant;
        const isMutant = this.isMutant(dna);
        const flatDNA = dna.join();
        const dnaEntity: DNAEntity = new DNAEntity(flatDNA, isMutant);
        await this.dnaRepository.save(dnaEntity);
        return isMutant;
    }

    public async getStats(): Promise<{count_mutant_dna: number, count_human_dna: number, ratio: number}> {
        const result = await this.dnaRepository.findStats();
        if (!result) return { count_mutant_dna: 0, count_human_dna: 0, ratio: 0 };
        return {
            count_mutant_dna: result.mutants,
            count_human_dna: result.humans,
            ratio: result.mutants / result.humans
        };
    }

}