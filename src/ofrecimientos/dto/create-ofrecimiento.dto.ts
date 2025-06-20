import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOfrecimientoDto {
  @IsNumber()
  @IsNotEmpty()
  oferta_id: number;

  @IsOptional()
  mensaje?: string;
}


