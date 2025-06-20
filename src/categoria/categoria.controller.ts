import { Controller, Get, Post, Body, Param, Delete, Put, BadRequestException } from '@nestjs/common'
import { CategoriaService } from './categoria.service'
import { UpdateCategoriaDto } from './DTOs/updateCatDto'
import { CreateCategoriaDto } from './DTOs/createCatDto'

/**
 * Controlador encargado de manejar las rutas relacionadas con categorías.
 */
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  /**
   * Crea una nueva categoría.
   * @param dto - Objeto con los datos de la nueva categoría.
   * @returns La categoría creada.
   */
  @Post()
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriaService.create(dto)
  }

  /**
   * Devuelve la lista de todas las categorías.
   * @returns Arreglo de categorías.
   */
  @Get()
  findAll() {
    return this.categoriaService.findAll()
  }

  /**
   * Busca una categoría por su ID.
   * @param id - ID de la categoría a buscar.
   * @returns La categoría encontrada, o undefined si no existe.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(+id)
  }

  /**
   * Actualiza una categoría existente.
   * @param id - ID de la categoría a actualizar.
   * @param dto - Datos nuevos para la categoría.
   * @returns La categoría actualizada.
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoriaDto) {
    return this.categoriaService.update(+id, dto)
  }

  /**
   * Elimina una categoría si no tiene ofertas asociadas.
   * @param id - ID de la categoría a eliminar.
   * @returns Mensaje de confirmación o error si tiene ofertas asociadas.
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.categoriaService.remove(+id);
    } catch (error) {
      throw new BadRequestException('No se puede eliminar la categoría porque tiene ofertas asociadas.');
    }
  }
}
