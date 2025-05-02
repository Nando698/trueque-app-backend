// src/categoria/categoria.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Oferta } from '../../oferta/entities/oferta.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Oferta, oferta => oferta.categoria)
  ofertas: Oferta[];
}
