import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../Request/Request';
import { CreateOfrecimientoDto } from './dto/create-ofrecimiento.dto';
import { OfrecimientosService } from '../ofrecimientos/ofrecimientos.service';

/**
 * Controlador para gestionar los ofrecimientos (contraofertas) de la aplicación.
 * @remarks
 * Todas las rutas requieren un JWT válido.
 * @group Ofrecimientos
 */
@Controller('ofrecimientos')
@UseGuards(JwtAuthGuard)
export class OfrecimientosController {
  constructor(private readonly ofrecimientoService: OfrecimientosService) {}

  /**
   * Crea un nuevo ofrecimiento para una oferta existente.
   *
   * @param dto - Datos del ofrecimiento: `{ oferta_id, mensaje? }`
   * @param req - Request autenticada, contiene `user.id` del solicitante
   * @returns El ofrecimiento guardado en la base de datos
   */
  @Post()
  crear(
    @Body() dto: CreateOfrecimientoDto,
    @Req() req: AuthRequest,
  ) {
    console.log('entrando al controller');
    const usuarioId = req.user.id;
    return this.ofrecimientoService.crear(dto, usuarioId);
  }

  /**
   * Obtiene la lista de ofrecimientos recibidos por el usuario dueño de las ofertas.
   *
   * @param req - Request autenticada, contiene `user.id` del propietario de las ofertas
   * @returns Array de ofrecimientos donde el usuario es propietario de la oferta
   */
  @Get('recibidos')
  recibidos(@Req() req: AuthRequest) {
    const usuarioId = req.user.id;
    return this.ofrecimientoService.obtenerRecibidos(usuarioId);
  }

  /**
   * Obtiene la lista de ofrecimientos enviados por el usuario autenticado.
   *
   * @param req - Request autenticada, contiene `user.id` del remitente de los ofrecimientos
   * @returns Array de ofrecimientos enviados por el usuario
   */
  @Get('enviados')
  enviados(@Req() req: AuthRequest) {
    const usuarioId = req.user.id;
    return this.ofrecimientoService.obtenerEnviados(usuarioId);
  }

  /**
   * Acepta un ofrecimiento pendiente de la lista de recibidos.
   * Al aceptar:
   *  - Cambia el estado del ofrecimiento a `ACEPTADO`
   *  - Marca la oferta como `FINALIZADA`
   *  - Rechaza automáticamente los demás ofrecimientos
   *
   * @param id - ID del ofrecimiento a aceptar
   * @param req - Request autenticada, contiene `user.id` del propietario de la oferta
   * @returns Objeto con mensaje de éxito y datos de contacto del oferente
   */
  @Post(':id/aceptar')
  aceptar(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.ofrecimientoService.aceptar(+id, req.user.id);
  }

  /**
   * Rechaza un ofrecimiento pendiente.
   *
   * @param id - ID del ofrecimiento a rechazar
   * @param req - Request autenticada, contiene `user.id` del propietario de la oferta
   * @returns El ofrecimiento actualizado con estado `RECHAZADO`
   */
  @Post(':id/rechazar')
  rechazar(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.ofrecimientoService.rechazar(+id, req.user.id);
  }
}
