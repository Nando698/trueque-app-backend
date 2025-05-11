import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Oferta } from './entities/oferta.entity'
import { Usuario } from 'src/usuario/entities/usuario.entity'
import { Categoria } from 'src/categoria/entities/categoria.entity'
import { OfertaService } from './oferta.service'
import { OfertaController } from './oferta.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Oferta, Usuario, Categoria])],
  controllers: [OfertaController],
  providers: [OfertaService],
})
export class OfertaModule {}

