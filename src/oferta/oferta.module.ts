import { Module } from '@nestjs/common';
import { OfertaService } from './oferta.service';
import { OfertaController } from './oferta.controller';


@Module({
  providers: [OfertaService],
  controllers: [OfertaController]
})
export class OfertaModule {}
