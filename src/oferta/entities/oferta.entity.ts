/**
 * Posibles estados en el ciclo de vida de una oferta.
 */
export enum EstadoOferta {
  /** Oferta disponible para trueque o consulta */
  ACTIVA = 'ACTIVA',

  /** Oferta se ha cerrado y ya no está disponible */
  FINALIZADA = 'FINALIZADA',

  /** Oferta permanece inhabilitada temporalmente */
  PAUSADA = 'PAUSADA',
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { Favorito } from '../../favorito/entities/favorito.entity';
import { Ofrecimiento } from '../../ofrecimientos/entities/ofrecimiento.entity';

/**
 * Representa una oferta publicada por un usuario.
 * @remarks
 * - Tabla: `ofertas`
 * - Una oferta pertenece a un usuario y a una categoría.
 * - Puede tener varias imágenes, favoritos y ofrecimientos.
 */
@Entity('ofertas')
export class Oferta {
  /** Identificador único de la oferta */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Usuario que creó la oferta.
   * Elimina en cascada si el usuario es borrado.
   */
  @ManyToOne(() => Usuario, (usuario) => usuario.ofertas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  /** Título breve de la oferta */
  @Column()
  titulo: string;

  /** Descripción completa de la oferta */
  @Column({ type: 'text' })
  descripcion: string;

  /**
   * URLs de las imágenes asociadas.
   * Puede ser nulo o vacío si no hay imágenes.
   */
  @Column({ type: 'text', array: true, nullable: true })
  imagenes: string[];

  /** Descripción del intercambio o “cambio” propuesto */
  @Column({ nullable: true })
  cambio: string;

  /**
   * Categoría a la que pertenece la oferta.
   */
  @ManyToOne(() => Categoria, (categoria) => categoria.ofertas)
  @JoinColumn({ name: 'categoria' })
  categoria: Categoria;

  /**
   * Fecha en que se creó la oferta.
   * Se completa automáticamente al insertar.
   */
  @CreateDateColumn({ name: 'fecha_publicacion' })
  fechaPublicacion: Date;

  /** Estado actual de la oferta (ACTIVA, PAUSADA o FINALIZADA) */
  @Column({ type: 'enum', enum: EstadoOferta })
  estado: EstadoOferta;

  /**
   * Lista de favoritos realizados a esta oferta.
   */
  @OneToMany(() => Favorito, (fav) => fav.oferta)
  favoritos: Favorito[];

  /**
   * Contraofertas (ofrecimientos) asociadas.
   * Se eliminan en cascada si la oferta es borrada.
   */
  @OneToMany(() => Ofrecimiento, (ofrecimiento) => ofrecimiento.oferta, {
    cascade: true,
  })
  ofrecimientos: Ofrecimiento[];
}
