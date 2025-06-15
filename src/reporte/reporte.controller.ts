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
  
  @Controller('reportes')
  export class ReporteOfertaController {
    constructor(private readonly reporteService: ReporteOfertaService) {}
  
    
    @UseGuards(JwtAuthGuard)
    @Post()
    crearReporte(@Body() dto: CrearReporteDto, @Req() req: AuthRequest) {
        console.log("dto desde post a reportes",dto);
        const usuarioId = req.user.id;
        return this.reporteService.crear(dto, usuarioId);
    }
  
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    listarTodos() {
      return this.reporteService.findAll();
    }
  }
  