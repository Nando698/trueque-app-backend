import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm'
import { Usuario } from 'src/usuario/entities/usuario.entity'
import { Oferta } from 'src/oferta/entities/oferta.entity'

@Entity('favoritos')
@Unique(['usuario', 'oferta']) // evita duplicados
export class Favorito {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario

  @ManyToOne(() => Oferta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'oferta_id' })
  oferta: Oferta

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_agregado: Date
}
