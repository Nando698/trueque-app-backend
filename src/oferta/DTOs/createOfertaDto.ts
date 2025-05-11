import { IsNotEmpty, IsString, IsEnum, IsInt, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator'
import { EstadoOferta } from '../entities/oferta.entity'

export class CreateOfertaDto {
  @IsNotEmpty()
  @IsString()
  titulo: string

  @IsNotEmpty()
  @IsString()
  descripcion: string

  @IsNotEmpty()
  @IsInt()
  categoria_id: number

  @IsNotEmpty()
  @IsEnum(EstadoOferta)
  estado: EstadoOferta

  @IsNotEmpty()
  @IsInt()
  usuario_id: number

  @IsOptional()
  @IsString()
  imagen?: string

 
}
