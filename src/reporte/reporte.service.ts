import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteOferta } from '../reporte/entities/reporte.entity';
import { CrearReporteDto } from './DTOs/reporteDto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Oferta } from '../oferta/entities/oferta.entity';

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

  async findAll(): Promise<ReporteOferta[]> {
    return this.reporteRepo.find({
      order: { fechaReporte: 'DESC' },
    });
  }

  async findByOferta(ofertaId: number): Promise<ReporteOferta[]> {
    return this.reporteRepo.find({
      where: { oferta: { id: ofertaId } },
    });
  }
}
