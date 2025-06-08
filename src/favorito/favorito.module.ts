import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavoritoController } from './favorito.controller';
import { FavoritoService } from './favorito.service';
import { Favorito } from './entities/favorito.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Oferta } from 'src/oferta/entities/oferta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorito, Usuario, Oferta])],
  controllers: [FavoritoController],
  providers: [FavoritoService],
})
export class FavoritoModule {}