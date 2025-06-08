// src/oferta/oferta.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
    JoinColumn, CreateDateColumn, OneToMany, ManyToMany, JoinTable
  } from 'typeorm';
  import { Usuario } from '../../usuario/entities/usuario.entity';
  import { Categoria } from '../../categoria/entities/categoria.entity';
  import { Favorito } from '../../favorito/entities/favorito.entity';
  
  
  export enum EstadoOferta {
    ACTIVA = 'ACTIVA',
    FINALIZADA = 'FINALIZADA',
    PAUSADA = 'PAUSADA',
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
    
    @Column({ type: 'text', array: true, nullable: true })
    imagenes: string[];

    @Column({ nullable: true })
    cambio: string;

    @ManyToOne(() => Categoria, categoria => categoria.ofertas)
    @JoinColumn({ name: 'categoria' })
    categoria: Categoria;
  
    @CreateDateColumn({ name: 'fecha_publicacion' })
    fechaPublicacion: Date;
  
    @Column({ type: 'enum', enum: EstadoOferta })
    estado: EstadoOferta;
  
    
  
    @OneToMany(() => Favorito, fav => fav.oferta)
    favoritos: Favorito[];
  }
  