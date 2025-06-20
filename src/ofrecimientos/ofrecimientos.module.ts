import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ofrecimiento } from './entities/ofrecimiento.entity';
import { OfrecimientosService } from './ofrecimientos.service';
import { OfrecimientosController } from './ofrecimientos.controller';
import { Oferta } from '../oferta/entities/oferta.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ofrecimiento, Oferta, Usuario])],
  providers: [OfrecimientosService],
  controllers: [OfrecimientosController],
  exports: [OfrecimientosService],
})
export class OfrecimientosModule {}
