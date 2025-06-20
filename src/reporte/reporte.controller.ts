import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReporteOfertaService } from './reporte.service';
import { CrearReporteDto } from './DTOs/reporteDto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthRequest } from '../Request/Request';

/**
 * Controlador para manejar los reportes de ofertas.
 */
@Controller('reportes')
export class ReporteOfertaController {
  constructor(private readonly reporteService: ReporteOfertaService) {}

  /**
   * Crea un nuevo reporte de una oferta.
   * Solo accesible para usuarios autenticados.
   * @param dto Datos del reporte a crear.
   * @param req Contiene el usuario autenticado.
   * @returns El reporte creado.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  crearReporte(@Body() dto: CrearReporteDto, @Req() req: AuthRequest) {
    console.log('dto desde post a reportes', dto);
    const usuarioId = req.user.id;
    return this.reporteService.crear(dto, usuarioId);
  }

  /**
   * Devuelve todos los reportes existentes.
   * Solo accesible para administradores autenticados.
   * @returns Lista de reportes.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  listarTodos() {
    return this.reporteService.findAll();
  }
}
