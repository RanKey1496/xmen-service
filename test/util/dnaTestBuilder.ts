export default class DNATestBuilder {
    private dna: Array<string> = [];

    public static newDNA() {
        return new DNATestBuilder;
    }

    public withRow(row: string): DNATestBuilder {
        this.dna.push(row);
        return this;
    }

    public withEmptyData(): DNATestBuilder {
        return this;
    }

    public withValidValues(): DNATestBuilder {
        return this.withRow('ATGC').withRow('ACCC').withRow('GTTG').withRow('TTAA');
    }

    public withInvalidValues(): DNATestBuilder {
        return this.withRow('ABCD').withRow('READ').withRow('TDAD').withRow('TDFA')
    }

    public withRandomValidRow(length: number): DNATestBuilder {
        const validChars = 'ATGC';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += validChars.charAt(Math.floor(Math.random() * validChars.length));
        }
        return this.withRow(result);
    }

    public withRandomInvalidRow(length: number): DNATestBuilder {
        const validChars = 'DESX';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += validChars.charAt(Math.floor(Math.random() * validChars.length));
        }
        return this.withRow(result);
    }

    public withRandomValidDNA(dnaLength: number): DNATestBuilder {
        for (let i = 0; i < dnaLength; i++) {
            this.withRandomValidRow(dnaLength);
        }
        return this;
    }

    public withRandomInvalidDNA(dnaLength: number): DNATestBuilder {
        for (let i = 0; i < dnaLength; i++) {
            this.withRandomInvalidRow(dnaLength);            
        }
        return this;
    }

    public build(): Array<string> {
        return this.dna;
    }

}