import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { OfertaService } from './oferta.service';
import { CreateOfertaDto } from './DTOs/createOfertaDto';
import { UpdateOfertaDto } from './DTOs/updateOfertaDto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/Request/Request';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { EstadoOferta } from './entities/oferta.entity';

/**
 * Controlador encargado de manejar las rutas relacionadas con las ofertas.
 */
@UseGuards(JwtAuthGuard)
@Controller('ofertas')
export class OfertaController {
  constructor(private readonly ofertaService: OfertaService) {}

  /**
   * Crea una nueva oferta asociada al usuario autenticado.
   * Permite subir hasta 3 imágenes.
   * @param files Archivos de imagen subidos.
   * @param dto Datos de la oferta.
   * @param req Request con información del usuario autenticado.
   * @returns La oferta creada.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('imagenes', 3, {
      storage: diskStorage({
        destination: join(process.cwd(), 'src/upload'),
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateOfertaDto,
    @Req() req: AuthRequest,
  ) {
    const imagenes = files.map(
      (file) => `http://localhost:3001/src/upload/${file.filename}`,
    );

    const dtoConImagenes: CreateOfertaDto = {
      ...dto,
      imagenes,
      usuario_id: req.user.id,
    };

    return this.ofertaService.create(dtoConImagenes);
  }

  /**
   * Busca ofertas filtrando por categoría y/o texto libre.
   * @param categoriaId ID de la categoría.
   * @param busqueda Texto a buscar en el título o descripción.
   * @returns Lista de ofertas que coinciden.
   */
  @Get('buscar')
  buscar(
    @Query('categoria_id') categoriaId?: string,
    @Query('keywords') busqueda?: string,
  ) {
    return this.ofertaService.buscarPersonalizado({
      categoriaId,
      texto: busqueda?.toLowerCase(),
    });
  }

  /**
   * Obtiene todas las ofertas o filtra por usuario o categoría.
   * @param categoriaId ID de la categoría.
   * @param usuarioId ID del usuario.
   * @param estado Estado de la oferta.
   * @returns Lista de ofertas.
   */
  @Get()
  findAll(
    @Query('categoria_id') categoriaId?: string,
    @Query('usuario_id') usuarioId?: string,
    @Query('estado') estado?: string,
  ) {
    if (usuarioId) {
      return this.ofertaService.buscarPorUsuario(+usuarioId, estado);
    }
    if (categoriaId) {
      return this.ofertaService.buscarPorCategoria(+categoriaId);
    }
    return this.ofertaService.findAll();
  }

  /**
   * Devuelve una oferta por su ID.
   * @param id ID de la oferta.
   * @returns Oferta encontrada.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ofertaService.findOne(+id);
  }

  /**
   * Actualiza una oferta por ID.
   * @param id ID de la oferta.
   * @param dto Datos nuevos.
   * @returns Oferta actualizada.
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOfertaDto) {
    return this.ofertaService.update(+id, dto);
  }

  /**
   * Elimina una oferta (sólo administradores).
   * @param id ID de la oferta.
   * @returns Resultado de la operación.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ofertaService.remove(+id);
  }

  /**
   * Cambia el estado de una oferta a "PAUSADA".
   * @param id ID de la oferta.
   * @param req Request con usuario autenticado.
   * @returns Oferta actualizada.
   */
  @Patch(':id/pausar')
  async pausar(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.ofertaService.cambiarEstadoSiAutorizado(
      +id,
      EstadoOferta.PAUSADA,
      req.user.id,
      req.user.rol,
    );
  }

  /**
   * Cambia el estado de una oferta a "FINALIZADA".
   * @param id ID de la oferta.
   * @param req Request con usuario autenticado.
   * @returns Oferta actualizada.
   */
  @Patch(':id/finalizar')
  async finalizar(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.ofertaService.cambiarEstadoSiAutorizado(
      +id,
      EstadoOferta.FINALIZADA,
      req.user.id,
      req.user.rol,
    );
  }

  /**
   * Cambia el estado de una oferta a "ACTIVA".
   * @param id ID de la oferta.
   * @param req Request con usuario autenticado.
   * @returns Oferta actualizada.
   */
  @Patch(':id/despausar')
  async despausar(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.ofertaService.cambiarEstadoSiAutorizado(
      +id,
      EstadoOferta.ACTIVA,
      req.user.id,
      req.user.rol,
    );
  }
}
