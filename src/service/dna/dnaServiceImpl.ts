import { injectable, interfaces } from "inversify";
import { Forbidden } from "../../util/exception";
import DNAService from "./dnaService";

@injectable()
export default class DNAServiceImpl implements DNAService {

    /**
     * Valida si un parametro si es un Array
     * @param dna DNA Array
     */
    private isArray(dna: Array<string>): void {
        if (!Array.isArray(dna)) throw new Forbidden('Invalid DNA');
    }

    /**
     * Valida si la data si es NxN
     * @param dna DNA Array
     */
    private isSquare(dna: Array<string>): void {
        const isSameLength = dna.every((value, i, array) => value.length === array.length)
        if (!isSameLength) throw new Forbidden('DNA data isnt NxN');
    }

    /**
     * Valida que la data contenga solo caracteres validos
     * @param dna DNA Array
     */
    private lettersAreValid(dna: Array<string>): void {
        const valid = dna.every((value, i, array) => /^[ACGT]+$/.test(value))
        if (!valid) throw new Forbidden('DNA data contains invalid characters');
    }

    /**
     * Convierte la data en una matrix NxN
     * @param dna DNA Array
     */
    private formatDNA(dna: Array<string>): Array<Array<string>> {
        return dna.map(value => Array.from(value));
    }

    private addCoordinates(positions: Set<string>, x: number, y: number): Set<string> {
        positions.add(`${x},${y}`)
        return positions;
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
    private iterateOverWord(step: number, dna: Array<Array<string>>, x: number, y: number, 
        word: string, positions: Set<string>): Set<string> {
            if (word.length == 0) return positions
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
                    positions = this.addCoordinates(positions, x, y);
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
    private coordinatesThroughtSteps(dna: Array<Array<string>>, x: number, y: number, word: string): Set<string> {
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
            positions = this.addCoordinates(positions, x, y);
            positions = this.iterateOverWord(step['id'], dna, x, y, newWord, positions)
            if (positions) return positions;
        }
    }

    /**
     * Realiza todas las validaciones que debe tener la data enviada
     * @param dna DNA Array
     */
    public async validateDNA(dna: Array<string>): Promise<void> {
        this.isArray(dna);
        this.isSquare(dna);
        this.lettersAreValid(dna);
    }

    /**
     * Informa si el ADN es de mutante o no
     * @param dna DNA Array
     */
    public isMutant(dna: Array<string>): Promise<void> {
        const data = this.formatDNA(dna);
        console.log(data)
        const coordinates: Array<Set<string>> = [];
        for (let x = 0; x < dna.length; x++) {
            for (let y = 0; y < dna[0].length; y++) {
                const letter = dna[x][y];
                const positions = this.coordinatesThroughtSteps(data, x, y, `${letter.repeat(4)}`);
                if (positions && coordinates.indexOf(positions) == -1) {
                    coordinates.push(positions);
                }
            }
        }
        console.log(coordinates)
        if (coordinates.length > 1) {
            console.log('Is mutant');
            return;
        }
        throw new Forbidden('DNA isnt from a mutant');
    }

}