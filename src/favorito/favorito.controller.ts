import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavoritoService } from './favorito.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthRequest } from 'src/Request/Request';

/**
 * Controlador para gestionar los favoritos de los usuarios.
 * Requiere autenticación con JWT para acceder a las rutas.
 */
@Controller('favoritos')
@UseGuards(JwtAuthGuard)
export class FavoritoController {
  constructor(private readonly favoritoService: FavoritoService) {}

  /**
   * Agrega una oferta a los favoritos del usuario autenticado.
   * @param ofertaId - ID de la oferta a agregar a favoritos.
   * @param req - Objeto de la request con los datos del usuario autenticado.
   * @returns Mensaje de confirmación.
   */
  @Post(':ofertaId')
  async agregar(
    @Param('ofertaId') ofertaId: number,
    @Req() req: AuthRequest,
  ) {
    const usuarioId = req.user.id;
    return this.favoritoService.agregarFavorito(usuarioId, ofertaId);
  }

  /**
   * Devuelve todas las ofertas marcadas como favoritas por el usuario autenticado.
   * @param req - Objeto de la request con los datos del usuario autenticado.
   * @returns Lista de ofertas favoritas.
   */
  @Get()
  async obtenerFavoritos(@Req() req: AuthRequest) {
    const usuarioId = req.user.id;
    return this.favoritoService.listarFavoritosDeUsuario(usuarioId);
  }

  /**
   * Elimina una oferta de los favoritos del usuario autenticado.
   * @param ofertaId - ID de la oferta a eliminar de favoritos.
   * @param req - Objeto de la request con los datos del usuario autenticado.
   * @returns Mensaje de confirmación.
   */
  @Delete(':ofertaId')
  async eliminar(
    @Param('ofertaId') ofertaId: number,
    @Req() req: AuthRequest,
  ) {
    const usuarioId = req.user.id;
    return this.favoritoService.eliminarFavorito(usuarioId, ofertaId);
  }
}
