import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { UpdateCategoriaDto } from './DTOs/updateCatDto';
import { CreateCategoriaDto } from './DTOs/createCatDto';


/**
 * Servicio que gestiona las operaciones CRUD de las categorías.
 */
@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepo: Repository<Categoria>,
  ) {}

  /**
   * Crea una nueva categoría a partir del DTO proporcionado.
   * @param dto Datos necesarios para crear una categoría.
   * @returns La categoría creada.
   */
  create(dto: CreateCategoriaDto) {
    const nueva = this.categoriaRepo.create(dto);
    return this.categoriaRepo.save(nueva);
  }

  /**
   * Obtiene todas las categorías existentes.
   * @returns Un array de categorías.
   */
  findAll() {
    return this.categoriaRepo.find();
  }

  /**
   * Busca una categoría por su ID.
   * @param id ID de la categoría.
   * @returns La categoría encontrada o `null` si no existe.
   */
  findOne(id: number) {
    return this.categoriaRepo.findOneBy({ id });
  }

  /**
   * Actualiza una categoría existente.
   * @param id ID de la categoría a actualizar.
   * @param dto Datos nuevos de la categoría.
   * @returns La categoría actualizada.
   */
  async update(id: number, dto: UpdateCategoriaDto) {
    await this.categoriaRepo.update(id, dto);
    return this.findOne(id);
  }

  /**
   * Elimina una categoría si no tiene ofertas asociadas.
   * @param id ID de la categoría a eliminar.
   * @throws NotFoundException si la categoría no existe.
   * @throws BadRequestException si la categoría tiene ofertas asociadas.
   * @throws InternalServerErrorException si ocurre un error inesperado.
   * @returns La categoría eliminada.
   */
  async remove(id: number) {
    const categoria = await this.findOne(id);
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    try {
      return await this.categoriaRepo.remove(categoria);
    } catch (error: any) {
      if (error?.code === '23503') {
        throw new BadRequestException('No se puede eliminar la categoría porque tiene ofertas asociadas.');
      }
      console.error('Error inesperado al eliminar categoría:', error);
      throw new InternalServerErrorException('Error inesperado al eliminar la categoría.');
    }
  }
}
