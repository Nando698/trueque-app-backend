import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { CategoriaService } from './categoria.service'
import { UpdateCategoriaDto } from './DTOs/updateCatDto'
import { CreateCategoriaDto } from './DTOs/createCatDto'

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriaService.create(dto)
  }

  @Get()
  findAll() {
    return this.categoriaService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(+id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoriaDto) {
    return this.categoriaService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaService.remove(+id)
  }
}
