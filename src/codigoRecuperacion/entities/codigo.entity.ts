import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class RecoveryCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  correo: string;

  @Column()
  codigo: string;

  @CreateDateColumn()
  creadoEn: Date;
}