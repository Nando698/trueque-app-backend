import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateContactoDto {
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsNotEmpty()
  mensaje: string;
}
