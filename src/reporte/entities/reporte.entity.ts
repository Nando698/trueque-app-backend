import { Oferta } from 'src/oferta/entities/oferta.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
    JoinColumn, CreateDateColumn} from 'typeorm';

@Entity('reportes_oferta')
export class ReporteOferta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Oferta, { eager: true, onDelete: 'CASCADE' })
@JoinColumn({ name: 'oferta_id' })
oferta: Oferta;

  @Column({ type: 'text' })
  motivo: string;

  @CreateDateColumn()
  fechaReporte: Date;
}
