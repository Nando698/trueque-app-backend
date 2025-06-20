import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoOferta, Oferta } from './entities/oferta.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { CreateOfertaDto } from './DTOs/createOfertaDto';
import { UpdateOfertaDto } from './DTOs/updateOfertaDto';

/**
 * Servicio encargado de la lógica de negocio relacionada con las ofertas.
 */
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

  /**
   * Crea una nueva oferta.
   * @param dto Datos necesarios para crear una oferta.
   * @returns La oferta creada.
   */
  async create(dto: CreateOfertaDto) {
    const usuario = await this.usuarioRepo.findOneBy({ id: dto.usuario_id });
    const categoria = await this.categoriaRepo.findOneBy({ id: dto.categoria_id });

    if (!usuario || !categoria) throw new NotFoundException('Usuario o categoría no encontrados');

    const nuevaOferta = this.ofertaRepo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      estado: dto.estado,
      cambio: dto.cambio,
      usuario,
      categoria,
      fechaPublicacion: new Date().toISOString().split('T')[0],
      imagenes: dto.imagenes,
    });

    return this.ofertaRepo.save(nuevaOferta);
  }

  /**
   * Devuelve todas las ofertas activas.
   * @returns Lista de ofertas activas.
   */
  async findAll() {
    return this.ofertaRepo.find({
      where: { estado: EstadoOferta.ACTIVA },
      relations: ['usuario', 'categoria'],
    });
  }

  /**
   * Busca ofertas por categoría.
   * @param categoriaId ID de la categoría.
   * @returns Ofertas de esa categoría.
   */
  async buscarPorCategoria(categoriaId: number) {
    return this.ofertaRepo.find({
      where: {
        categoria: { id: categoriaId },
        estado: EstadoOferta.ACTIVA,
      },
      relations: ['usuario', 'categoria'],
    });
  }

  /**
   * Busca ofertas por usuario y, opcionalmente, estado.
   * @param usuarioId ID del usuario.
   * @param estado Estado de la oferta.
   * @returns Ofertas del usuario filtradas.
   */
  async buscarPorUsuario(usuarioId: number, estado?: string) {
    const filtros: any = {
      usuario: { id: usuarioId },
    };

    if (estado) {
      filtros.estado = estado;
    }

    return this.ofertaRepo.find({
      where: filtros,
      relations: ['usuario', 'categoria'],
    });
  }

  /**
   * Busca una oferta por su ID.
   * @param id ID de la oferta.
   * @returns Oferta encontrada.
   */
  findOne(id: number) {
    return this.ofertaRepo.findOne({
      where: { id },
      relations: ['usuario', 'categoria'],
    });
  }

  /**
   * Actualiza una oferta existente.
   * @param id ID de la oferta.
   * @param dto Datos a actualizar.
   * @returns Oferta actualizada.
   */
  async update(id: number, dto: UpdateOfertaDto) {
    const oferta = await this.findOne(id);
    if (!oferta) throw new NotFoundException('Oferta no encontrada');

    Object.assign(oferta, dto);
    return this.ofertaRepo.save(oferta);
  }

  /**
   * Realiza una búsqueda personalizada de ofertas.
   * @param filtro Filtros opcionales por categoría y/o texto.
   * @returns Lista de ofertas que coinciden.
   */
  async buscarPersonalizado(filtro: { categoriaId?: string; texto?: string }) {
    const query = this.ofertaRepo.createQueryBuilder('oferta')
      .leftJoinAndSelect('oferta.usuario', 'usuario')
      .leftJoinAndSelect('oferta.categoria', 'categoria');

    if (filtro.categoriaId) {
      const categoriaIds = filtro.categoriaId
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));

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

  /**
   * Elimina una oferta por su ID.
   * @param id ID de la oferta.
   */
  async remove(id: number): Promise<void> {
    const oferta = await this.ofertaRepo.findOne({ where: { id } });

    if (!oferta) {
      throw new NotFoundException(`No se encontró una oferta con id ${id}`);
    }

    await this.ofertaRepo.remove(oferta);
  }

  /**
   * Cambia el estado de una oferta (sin verificar permisos).
   * @param id ID de la oferta.
   * @param nuevoEstado Estado a aplicar.
   * @returns Oferta con nuevo estado.
   */
  async cambiarEstado(id: number, nuevoEstado: EstadoOferta): Promise<Oferta> {
    const oferta = await this.ofertaRepo.findOne({ where: { id } });
    if (!oferta) throw new NotFoundException('Oferta no encontrada');

    oferta.estado = nuevoEstado;
    return await this.ofertaRepo.save(oferta);
  }

  /**
   * Cambia el estado de una oferta si el usuario es propietario o admin.
   * @param id ID de la oferta.
   * @param nuevoEstado Estado deseado.
   * @param usuarioId ID del usuario que realiza la acción.
   * @param rol Rol del usuario (para verificar si es admin).
   * @returns Oferta actualizada.
   */
  async cambiarEstadoSiAutorizado(
    id: number,
    nuevoEstado: EstadoOferta,
    usuarioId: number,
    rol: string,
  ): Promise<Oferta> {
    const oferta = await this.ofertaRepo.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!oferta) throw new NotFoundException('Oferta no encontrada');

    const esAdmin = rol === 'ADMIN';
    const esPropietario = oferta.usuario.id === usuarioId;

    if (!esAdmin && !esPropietario) {
      throw new ForbiddenException('No estás autorizado para modificar esta oferta');
    }

    oferta.estado = nuevoEstado;
    return await this.ofertaRepo.save(oferta);
  }
}
