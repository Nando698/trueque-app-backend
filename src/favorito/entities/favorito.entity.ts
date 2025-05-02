
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Oferta } from '../../oferta/entities/oferta.entity';

@Entity('favoritos')
export class Favorito {
  @PrimaryColumn({ name: 'usuario_id' })
  usuarioId: number;

  @PrimaryColumn({ name: 'oferta_id' })
  ofertaId: number;

  @ManyToOne(() => Usuario, usuario => usuario.favoritos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Oferta, oferta => oferta.favoritos)
  @JoinColumn({ name: 'oferta_id' })
  oferta: Oferta;
}
