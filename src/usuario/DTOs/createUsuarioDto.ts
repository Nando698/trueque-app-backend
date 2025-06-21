
import { IsString, IsEmail, IsEnum, isEnum } from 'class-validator';
import { RolUsuario, EstadoUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  password: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @IsEnum(EstadoUsuario)
  estado: EstadoUsuario;
}
