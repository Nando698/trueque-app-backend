import {
    Entity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Oferta } from '../../oferta/entities/oferta.entity';
  import { Etiqueta } from '../../etiqueta/entities/etiqueta.entity';
  
  @Entity('oferta_etiqueta')
  export class OfertaEtiqueta {
    @PrimaryColumn({ name: 'oferta_id', type: 'bigint' })
    ofertaId: number;
  
    @PrimaryColumn({ name: 'etiqueta_id', type: 'bigint' })
    etiquetaId: number;
  
    @ManyToOne(() => Oferta, oferta => oferta.ofertaEtiquetas)
    @JoinColumn({ name: 'oferta_id' })
    oferta: Oferta;
  
    @ManyToOne(() => Etiqueta, etiqueta => etiqueta.ofertaEtiquetas)
    @JoinColumn({ name: 'etiqueta_id' })
    etiqueta: Etiqueta;
  }
  