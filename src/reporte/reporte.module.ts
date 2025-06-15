import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReporteOferta } from './entities/reporte.entity'
import { ReporteOfertaController } from './reporte.controller'
import { ReporteOfertaService } from './reporte.service'
import { Oferta } from 'src/oferta/entities/oferta.entity'
import { Usuario } from 'src/usuario/entities/usuario.entity'





@Module({
    imports: [TypeOrmModule.forFeature([ReporteOferta, Oferta, Usuario])],
    controllers: [ReporteOfertaController],
    providers: [ReporteOfertaService],
  })
  export class ReporteOfertaModule {}
  