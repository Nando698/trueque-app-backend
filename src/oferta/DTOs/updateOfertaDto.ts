import { PartialType } from '@nestjs/mapped-types'
import { CreateOfertaDto } from './createOfertaDto'

export class UpdateOfertaDto extends PartialType(CreateOfertaDto) {}
