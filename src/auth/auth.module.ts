import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { JwtStrategy } from './jwt.strategy';
import { RecoveryCode } from '../codigoRecuperacion/entities/codigo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: 'tpProgramacion3',
      signOptions: { expiresIn: '1000m' },
    }),
    TypeOrmModule.forFeature([RecoveryCode]) 
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

