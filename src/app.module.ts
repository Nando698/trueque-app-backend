import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario/entities/usuario.entity';
import { Oferta } from './oferta/entities/oferta.entity';
import { ReporteOferta } from './reporte/entities/reporte.entity';
import { Categoria } from './categoria/entities/categoria.entity';
import { Favorito } from './favorito/entities/favorito.entity';
import { FavoritoService } from './favorito/favorito.service';
import { FavoritoController } from './favorito/favorito.controller';
import { CategoriaService } from './categoria/categoria.service';
import { CategoriaController } from './categoria/categoria.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { OfertaModule } from './oferta/oferta.module';
import { OfertaService } from './oferta/oferta.service';
import { OfertaController } from './oferta/oferta.controller';
import { AuthModule } from './auth/auth.module';
import { FavoritoModule } from './favorito/favorito.module';
import { ReporteOfertaModule } from './reporte/reporte.module';
import { RecoveryCode } from './codigoRecuperacion/entities/codigo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, UsuarioModule, OfertaModule, FavoritoModule, ReporteOfertaModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Usuario, Oferta, Categoria, Favorito, ReporteOferta, RecoveryCode],
        synchronize: true, 
      }),
    }),

    TypeOrmModule.forFeature([
      Usuario,
      Oferta,
      Categoria,
      Favorito,
      ReporteOferta,
      RecoveryCode
    ]),

    AuthModule,

    
  ],
  providers: [AppService, FavoritoService,  CategoriaService, OfertaService],
  controllers: [AppController, FavoritoController, CategoriaController, OfertaController],
})
export class AppModule {}
