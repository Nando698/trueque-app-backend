import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Categoria } from './entities/categoria.entity'
import { UpdateCategoriaDto } from './DTOs/updateCatDto'
import { CreateCategoriaDto } from './DTOs/createCatDto'

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepo: Repository<Categoria>,
  ) {}

  create(dto: CreateCategoriaDto) {
    const nueva = this.categoriaRepo.create(dto)
    return this.categoriaRepo.save(nueva)
  }

  findAll() {
    return this.categoriaRepo.find()
  }

  findOne(id: number) {
    return this.categoriaRepo.findOneBy({ id })
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    await this.categoriaRepo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number) {
    const categoria = await this.findOne(id)
    if (!categoria) throw new NotFoundException('Categoría no encontrada')
    return this.categoriaRepo.remove(categoria)
  }
}
