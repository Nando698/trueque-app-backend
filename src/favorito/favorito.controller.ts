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
import { Request } from 'express';
import { AuthRequest } from 'src/Request/Request';



@Controller('favoritos')
@UseGuards(JwtAuthGuard)
export class FavoritoController {
  constructor(private readonly favoritoService: FavoritoService) {}

  // Agregar favorito
  @Post(':ofertaId')
  async agregar(
    @Param('ofertaId') ofertaId: number,
    @Req() req: AuthRequest,
  ) {
    const usuarioId = req.user.id;
    return this.favoritoService.agregarFavorito(usuarioId, ofertaId);
  }

  // Obtener todos los favoritos del usuario autenticado
  @Get()
  async obtenerFavoritos(@Req() req: AuthRequest) {
    const usuarioId = req.user.id;
    return this.favoritoService.listarFavoritosDeUsuario(usuarioId);
  }

  // Eliminar favorito
  @Delete(':ofertaId')
  async eliminar(
    @Param('ofertaId') ofertaId: number,
    @Req() req: AuthRequest,
  ) {
    const usuarioId = req.user.id;
    return this.favoritoService.eliminarFavorito(usuarioId, ofertaId);
  }
}
