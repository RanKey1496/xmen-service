import { injectable } from "inversify";
import { Forbidden } from "../../util/exception";
import DNAService from "./dnaService";

@injectable()
export default class DNAServiceImpl implements DNAService {

    public async validateDNA(dna: string[]): Promise<void> {
        throw new Forbidden("Method not implemented.");
    }

}