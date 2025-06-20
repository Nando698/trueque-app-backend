import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { Usuario } from 'src/usuario/entities/usuario.entity';
  import { Oferta } from 'src/oferta/entities/oferta.entity';
  
  export enum EstadoOfrecimiento {
    PENDIENTE = 'PENDIENTE',
    ACEPTADO = 'ACEPTADO',
    RECHAZADO = 'RECHAZADO',
  }
  
  @Entity()
  export class Ofrecimiento {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'text', nullable: true })
    mensaje: string;
  
    @Column({
      type: 'enum',
      enum: EstadoOfrecimiento,
      default: EstadoOfrecimiento.PENDIENTE,
    })
    estado: EstadoOfrecimiento;
  
    @CreateDateColumn()
    fecha: Date;
  
    @ManyToOne(() => Usuario, (usuario) => usuario.ofrecimientos, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;
  
    @ManyToOne(() => Oferta, (oferta) => oferta.ofrecimientos, {
      eager: true,
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'oferta_id' })
    oferta: Oferta;
  }
  
  
