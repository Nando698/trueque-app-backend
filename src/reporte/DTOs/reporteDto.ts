import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CrearReporteDto {
  @IsNumber()
  @IsNotEmpty()
  oferta_id: number;

  @IsString()
  @IsNotEmpty()
  motivo: string;
}