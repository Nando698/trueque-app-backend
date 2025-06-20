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
import {OfrecimientosService} from '../ofrecimientos/ofrecimientos.service'

@Controller('ofrecimientos')
@UseGuards(JwtAuthGuard)
export class OfrecimientosController {
  constructor(private readonly ofrecimientoService: OfrecimientosService) {}

  @Post()
  crear(
    @Body() dto: CreateOfrecimientoDto,
    @Req() req: AuthRequest
  ) {
    console.log("entrando al controller")
    const usuarioId = req.user.id;
    return this.ofrecimientoService.crear(dto, usuarioId);
  }

  @Get('recibidos')
  recibidos(@Req() req: AuthRequest) {
    const usuarioId = req.user.id;
    return this.ofrecimientoService.obtenerRecibidos(usuarioId);
  }

  @Get('enviados')
  enviados(@Req() req: AuthRequest) {
    const usuarioId = req.user.id;
    return this.ofrecimientoService.obtenerEnviados(usuarioId);
  }

  @Post(':id/aceptar')
  aceptar(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.ofrecimientoService.aceptar(+id, req.user.id);
  }

  @Post(':id/rechazar')
rechazar(@Param('id') id: string, @Req() req: AuthRequest) {
  return this.ofrecimientoService.rechazar(+id, req.user.id);
}
}

