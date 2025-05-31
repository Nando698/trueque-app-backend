import { IsNotEmpty, IsString, IsEnum, IsInt, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator'
import { EstadoOferta } from '../entities/oferta.entity'
import { Type } from 'class-transformer'

export class CreateOfertaDto {
  @IsNotEmpty()
  @IsString()
  titulo: string

  @IsNotEmpty()
  @IsString()
  descripcion: string

  @Type(()=> Number)
  @IsNotEmpty()
  @IsInt()
  categoria_id: number

  @IsNotEmpty()
  @IsEnum(EstadoOferta)
  estado: EstadoOferta

   @Type(()=> Number)
  @IsNotEmpty()
  @IsInt()
  usuario_id: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagenes?: string[];

 
}
