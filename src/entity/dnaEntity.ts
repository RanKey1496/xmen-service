import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DNA')
export class DNAEntity {

    constructor(value: string, isMutant: boolean) {
        this.value = value;
        this.isMutant = isMutant;
    }

    @PrimaryGeneratedColumn()
    public id: Number;

    @Column({ nullable: false, unique: true })
    public value: String;

    @Column({ nullable: false })
    public isMutant: boolean;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date = new Date();

}