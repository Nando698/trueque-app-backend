import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteOferta } from '../reporte/entities/reporte.entity';
import { CrearReporteDto } from './DTOs/reporteDto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Oferta } from '../oferta/entities/oferta.entity';

/**
 * Servicio encargado de manejar los reportes de ofertas realizadas por los usuarios.
 */
@Injectable()
export class ReporteOfertaService {
  constructor(
    @InjectRepository(ReporteOferta)
    private readonly reporteRepo: Repository<ReporteOferta>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Oferta)
    private readonly ofertaRepo: Repository<Oferta>,
  ) {}

  /**
   * Crea un nuevo reporte de una oferta.
   * @param dto Datos necesarios para crear el reporte.
   * @param usuarioId ID del usuario que realiza el reporte.
   * @returns El reporte creado.
   * @throws NotFoundException Si el usuario o la oferta no existen.
   */
  async crear(dto: CrearReporteDto, usuarioId: number): Promise<ReporteOferta> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: usuarioId } });
    const oferta = await this.ofertaRepo.findOne({ where: { id: dto.oferta_id } });

    if (!usuario || !oferta) {
      throw new NotFoundException('Usuario u oferta no encontrada');
    }

    const nuevoReporte = this.reporteRepo.create({
      usuario,
      oferta,
      motivo: dto.motivo,
    });

    return this.reporteRepo.save(nuevoReporte);
  }

  /**
   * Devuelve todos los reportes ordenados por fecha descendente.
   * @returns Lista de reportes.
   */
  async findAll(): Promise<ReporteOferta[]> {
    return this.reporteRepo.find({
      order: { fechaReporte: 'DESC' },
    });
  }

  /**
   * Devuelve todos los reportes relacionados a una oferta específica.
   * @param ofertaId ID de la oferta.
   * @returns Lista de reportes para la oferta indicada.
   */
  async findByOferta(ofertaId: number): Promise<ReporteOferta[]> {
    return this.reporteRepo.find({
      where: { oferta: { id: ofertaId } },
    });
  }
}
