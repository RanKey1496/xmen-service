import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DNA')
export class DNAEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: String, nullable: false, unique: true })
    public value: String;

    @Column()
    public createdAt: Date = new Date();

}