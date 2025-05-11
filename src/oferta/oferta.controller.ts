import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common'
import { OfertaService } from './oferta.service'
import { CreateOfertaDto } from './DTOs/createOfertaDto'
import { UpdateOfertaDto } from './DTOs/updateOfertaDto'

@Controller('ofertas')
export class OfertaController {
  constructor(private readonly ofertaService: OfertaService) {}

  @Post()
  create(@Body() dto: CreateOfertaDto) {
    return this.ofertaService.create(dto)
  }

  @Get()
findAll(
  @Query('categoria_id') categoriaId?: string,
  @Query('usuario_id') usuarioId?: string,
) {
  if (usuarioId) {
    return this.ofertaService.buscarPorUsuario(+usuarioId)
  }

  if (categoriaId) {
    return this.ofertaService.buscarPorCategoria(+categoriaId)
  }

  return this.ofertaService.findAll()
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ofertaService.findOne(+id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOfertaDto) {
    return this.ofertaService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ofertaService.remove(+id)
  }




}
