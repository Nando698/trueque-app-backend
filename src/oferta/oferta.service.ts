import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'
import { EstadoOferta, Oferta } from './entities/oferta.entity'
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
    console.log("DTO:::", dto)

    if (!usuario || !categoria) throw new NotFoundException('Usuario o categoría no encontrados')

     
    
      const nuevaOferta = this.ofertaRepo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      estado: dto.estado,
      usuario,
      categoria,    
      fechaPublicacion: new Date().toISOString().split('T')[0],
      imagenes: dto.imagenes
      
      
    })

    return this.ofertaRepo.save(nuevaOferta)
  }

  findAll() {
    return this.ofertaRepo.find({
      where: { estado: EstadoOferta.ACTIVA, },
      relations: ['usuario', 'categoria'],
    })
  }
  
  async buscarPorCategoria(categoriaId: number) {
    return this.ofertaRepo.find({
      where: {
        categoria: { id: categoriaId },
        estado: EstadoOferta.ACTIVA,
      },
      relations: ['usuario', 'categoria'],
    })
  }

  async buscarPorUsuario(usuarioId: number) {
    return this.ofertaRepo.find({
      where: {
        usuario: { id: usuarioId },
        estado: EstadoOferta.ACTIVA,
      },
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

  
  
  
  
  async buscarPersonalizado(filtro: { categoriaId?: string; texto?: string }) {
  const query = this.ofertaRepo.createQueryBuilder('oferta')
    .leftJoinAndSelect('oferta.usuario', 'usuario')
    .leftJoinAndSelect('oferta.categoria', 'categoria');

  if (filtro.categoriaId) {
    const categoriaIds = filtro.categoriaId
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id)); // filtrás por si algún valor no era un número válido

    if (categoriaIds.length > 0) {
      query.andWhere('categoria.id IN (:...categoriaIds)', { categoriaIds });
    }
  }

  if (filtro.texto) {
    query.andWhere(
      '(LOWER(oferta.titulo) LIKE :texto OR LOWER(oferta.descripcion) LIKE :texto)',
      { texto: `%${filtro.texto.toLowerCase()}%` },
    );
  }

  return query.getMany();
}

async remove(id: number): Promise<void> {
  const oferta = await this.ofertaRepo.findOne({ where: { id } });

  if (!oferta) {
    throw new NotFoundException(`No se encontró una oferta con id ${id}`);
  }

  await this.ofertaRepo.remove(oferta);
}




}
