// src/usuario/usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Oferta } from '../../oferta/entities/oferta.entity';
import { Favorito } from '../../favorito/entities/favorito.entity';
import { Exclude } from 'class-transformer';
import { Ofrecimiento } from 'src/ofrecimientos/entities/ofrecimiento.entity';

export enum RolUsuario {
  ADMIN = 'ADMIN',
  NORMAL = 'NORMAL',
}

export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;

  @Column({ type: 'enum', enum: EstadoUsuario })
  estado: EstadoUsuario;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @OneToMany(() => Oferta, oferta => oferta.usuario)
  ofertas: Oferta[];

  @OneToMany(() => Favorito, fav => fav.usuario)
  favoritos: Favorito[];

  @OneToMany(() => Ofrecimiento, (ofrecimiento) => ofrecimiento.usuario)
ofrecimientos: Ofrecimiento[];
}
