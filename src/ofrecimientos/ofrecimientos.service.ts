import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { EstadoOfrecimiento, Ofrecimiento } from './entities/ofrecimiento.entity';
import { CreateOfrecimientoDto } from './dto/create-ofrecimiento.dto';
import { EstadoOferta, Oferta } from '../oferta/entities/oferta.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

/**
 * Servicio encargado de gestionar los ofrecimientos (contraofertas) en la plataforma.
 * @category Ofrecimientos
 */
@Injectable()
export class OfrecimientosService {
  constructor(
    @InjectRepository(Ofrecimiento)
    private ofrecimientoRepo: Repository<Ofrecimiento>,
    @InjectRepository(Oferta)
    private ofertaRepo: Repository<Oferta>,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  /**
   * Crea un nuevo ofrecimiento para una oferta existente.
   *
   * @param dto - Datos del ofrecimiento: `{ oferta_id, mensaje? }`
   * @param usuarioId - ID del usuario que realiza el ofrecimiento
   * @returns El ofrecimiento guardado en la base de datos
   * @throws NotFoundException si la oferta o el usuario no existen
   * @throws ForbiddenException si el usuario intenta ofrecer contra su propia oferta
   */
  async crear(dto: CreateOfrecimientoDto, usuarioId: number): Promise<Ofrecimiento> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: usuarioId } });
    const oferta = await this.ofertaRepo.findOne({
      where: { id: dto.oferta_id },
      relations: ['usuario'],
    });

    if (!usuario || !oferta) {
      throw new NotFoundException('Oferta o usuario no encontrado');
    }

    if (oferta.usuario.id === usuarioId) {
      throw new ForbiddenException('No podés contraofertar tu propia oferta');
    }

    const nuevo = this.ofrecimientoRepo.create({
      oferta,
      usuario,
      mensaje: dto.mensaje,
      estado: EstadoOfrecimiento.PENDIENTE,
    });

    return this.ofrecimientoRepo.save(nuevo);
  }

  /**
   * Obtiene todos los ofrecimientos recibidos para las ofertas de un usuario.
   *
   * @param usuarioId - ID del usuario propietario de las ofertas
   * @returns Array de ofrecimientos donde el usuario es dueño de la oferta
   */
  async obtenerRecibidos(usuarioId: number): Promise<Ofrecimiento[]> {
    return this.ofrecimientoRepo.find({
      where: { oferta: { usuario: { id: usuarioId } } },
      relations: ['oferta', 'usuario', 'oferta.categoria'],
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Obtiene todos los ofrecimientos enviados por un usuario.
   *
   * @param usuarioId - ID del usuario que envió los ofrecimientos
   * @returns Array de ofrecimientos enviados
   */
  async obtenerEnviados(usuarioId: number): Promise<Ofrecimiento[]> {
    return this.ofrecimientoRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['oferta', 'oferta.categoria'],
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Acepta un ofrecimiento pendiente.
   * - Cambia el estado del ofrecimiento a ACEPTADO.
   * - Marca la oferta como FINALIZADA.
   * - Rechaza automáticamente los demás ofrecimientos de la misma oferta.
   *
   * @param id - ID del ofrecimiento a aceptar
   * @param usuarioId - ID del usuario propietario de la oferta
   * @returns Objeto con mensaje de éxito y datos de contacto del oferente
   * @throws NotFoundException si el ofrecimiento no existe
   * @throws ForbiddenException si el usuario no es el dueño de la oferta
   */
  async aceptar(
    id: number,
    usuarioId: number,
  ): Promise<{ mensaje: string; contacto: { nombre: string; correo: string } }> {
    const ofrecimiento = await this.ofrecimientoRepo.findOne({
      where: { id },
      relations: ['oferta', 'usuario', 'oferta.usuario'],
    });

    if (!ofrecimiento) {
      throw new NotFoundException('Ofrecimiento no encontrado');
    }

    if (ofrecimiento.oferta.usuario.id !== usuarioId) {
      throw new ForbiddenException('No autorizado');
    }

    // Cambiar estado del ofrecimiento aceptado
    ofrecimiento.estado = EstadoOfrecimiento.ACEPTADO;
    await this.ofrecimientoRepo.save(ofrecimiento);

    // Cambiar estado de la oferta a FINALIZADA
    ofrecimiento.oferta.estado = EstadoOferta.FINALIZADA;
    await this.ofertaRepo.save(ofrecimiento.oferta);

    // Rechazar los demás ofrecimientos de la misma oferta
    await this.ofrecimientoRepo.update(
      {
        oferta: { id: ofrecimiento.oferta.id },
        id: Not(ofrecimiento.id),
      },
      { estado: EstadoOfrecimiento.RECHAZADO },
    );

    return {
      mensaje: 'Ofrecimiento aceptado. Estos son los datos de contacto del usuario:',
      contacto: {
        nombre: ofrecimiento.usuario.nombre,
        correo: ofrecimiento.usuario.correo,
      },
    };
  }

  /**
   * Rechaza un ofrecimiento pendiente.
   *
   * @param id - ID del ofrecimiento a rechazar
   * @param usuarioId - ID del usuario propietario de la oferta
   * @returns El ofrecimiento actualizado con estado RECHAZADO
   * @throws NotFoundException si el ofrecimiento no existe
   * @throws ForbiddenException si el usuario no es el dueño de la oferta
   */
  async rechazar(id: number, usuarioId: number): Promise<Ofrecimiento> {
    const ofrecimiento = await this.ofrecimientoRepo.findOne({
      where: { id },
      relations: ['oferta', 'usuario', 'oferta.usuario'],
    });

    if (!ofrecimiento) {
      throw new NotFoundException('Ofrecimiento no encontrado');
    }

    if (ofrecimiento.oferta.usuario.id !== usuarioId) {
      throw new ForbiddenException('No autorizado');
    }

    ofrecimiento.estado = EstadoOfrecimiento.RECHAZADO;
    return this.ofrecimientoRepo.save(ofrecimiento);
  }
}
