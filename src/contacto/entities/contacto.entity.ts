import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('mensajes_contacto')
export class Contacto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column({ type: 'text' })
  mensaje: string;

  @CreateDateColumn()
  fechaEnvio: Date;
}
