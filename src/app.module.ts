import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario/entities/usuario.entity';
import { Oferta } from './oferta/entities/oferta.entity';
import { Categoria } from './categoria/entities/categoria.entity';
import { Etiqueta } from './etiqueta/entities/etiqueta.entity';
import { Favorito } from './favorito/entities/favorito.entity';
import { OfertaEtiqueta } from './ofertaEtiqueta/entities/ofertaEtiqueta.entity';
import { FavoritoService } from './favorito/favorito.service';
import { FavoritoController } from './favorito/favorito.controller';
import { EtiquetaService } from './etiqueta/etiqueta.service';
import { EtiquetaController } from './etiqueta/etiqueta.controller';
import { CategoriaService } from './categoria/categoria.service';
import { CategoriaController } from './categoria/categoria.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { OfertaEtiquetaModule } from './ofertaEtiqueta/oferta-etiqueta.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, UsuarioModule, OfertaEtiquetaModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Usuario, Oferta, Categoria, Etiqueta, Favorito, OfertaEtiqueta],
        synchronize: true, // ⚠️ Solo en desarrollo
      }),
    }),

    TypeOrmModule.forFeature([
      Usuario,
      Oferta,
      Categoria,
      Etiqueta,
      Favorito,
      OfertaEtiqueta,
    ]),

    OfertaEtiquetaModule,
  ],
  providers: [AppService, FavoritoService, EtiquetaService, CategoriaService],
  controllers: [AppController, FavoritoController, EtiquetaController, CategoriaController],
})
export class AppModule {}
