// src/oferta/oferta.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
    JoinColumn, CreateDateColumn, OneToMany, ManyToMany, JoinTable
  } from 'typeorm';
  import { Usuario } from '../../usuario/entities/usuario.entity';
  import { Categoria } from '../../categoria/entities/categoria.entity';
  import { Etiqueta } from '../../etiqueta/entities/etiqueta.entity';
  import { Favorito } from '../../favorito/entities/favorito.entity';
  import { OfertaEtiqueta } from 'src/ofertaEtiqueta/entities/ofertaEtiqueta.entity';
  
  export enum EstadoOferta {
    ACTIVA = 'ACTIVA',
    FINALIZADA = 'FINALIZADA',
  }
  
  @Entity('ofertas')
  export class Oferta {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Usuario, usuario => usuario.ofertas)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;
  
    @Column()
    titulo: string;
  
    @Column({ type: 'text' })
    descripcion: string;
  
    @ManyToOne(() => Categoria, categoria => categoria.ofertas)
    @JoinColumn({ name: 'categoria' })
    categoria: Categoria;
  
    @CreateDateColumn({ name: 'fecha_publicacion' })
    fechaPublicacion: Date;
  
    @Column({ type: 'enum', enum: EstadoOferta })
    estado: EstadoOferta;
  
    @OneToMany(() => OfertaEtiqueta, oe => oe.oferta)
ofertaEtiquetas: OfertaEtiqueta[];
  
    @OneToMany(() => Favorito, fav => fav.oferta)
    favoritos: Favorito[];
  }
  