import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Oferta } from './entities/oferta.entity'
import { Usuario } from 'src/usuario/entities/usuario.entity'
import { Categoria } from 'src/categoria/entities/categoria.entity'
import { CreateOfertaDto } from './DTOs/createOfertaDto'
import { UpdateOfertaDto } from './DTOs/updateOfertaDto'

@Injectable()
export class OfertaService {
  constructor(
    @InjectRepository(Oferta)
    private ofertaRepo: Repository<Oferta>,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Categoria)
    private categoriaRepo: Repository<Categoria>,
  ) {}

  async create(dto: CreateOfertaDto) {
    const usuario = await this.usuarioRepo.findOneBy({ id: dto.usuario_id })
    const categoria = await this.categoriaRepo.findOneBy({ id: dto.categoria_id })

    if (!usuario || !categoria) throw new NotFoundException('Usuario o categoría no encontrados')

    const nuevaOferta = this.ofertaRepo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      estado: dto.estado,
      usuario,
      categoria,
      fechaPublicacion: new Date().toISOString().split('T')[0],
    })

    return this.ofertaRepo.save(nuevaOferta)
  }

  findAll() {
    return this.ofertaRepo.find({
      relations: ['usuario', 'categoria'],
    })
  }

  findOne(id: number) {
    return this.ofertaRepo.findOne({
      where: { id },
      relations: ['usuario', 'categoria'],
    })
  }

  async update(id: number, dto: UpdateOfertaDto) {
    const oferta = await this.findOne(id)
    if (!oferta) throw new NotFoundException('Oferta no encontrada')

    Object.assign(oferta, dto)
    return this.ofertaRepo.save(oferta)
  }

  async remove(id: number) {
    const oferta = await this.findOne(id)
    if (!oferta) throw new NotFoundException('Oferta no encontrada')

    return this.ofertaRepo.remove(oferta)
  }


  


}
