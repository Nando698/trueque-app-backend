// src/etiqueta/etiqueta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OfertaEtiqueta } from 'src/ofertaEtiqueta/entities/ofertaEtiqueta.entity';

@Entity('etiquetas')
export class Etiqueta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => OfertaEtiqueta, oe => oe.etiqueta)
ofertaEtiquetas: OfertaEtiqueta[];
}
