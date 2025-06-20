import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
  Request,
  Req,
  Query,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './DTOs/createUsuarioDto';
import { UpdateUsuarioDto } from './DTOs/updateUsuarioDto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthRequest } from 'src/Request/Request';

/**
 * Controlador para manejar las operaciones relacionadas con los usuarios.
 */
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  /**
   * Devuelve el perfil del usuario autenticado.
   * @param req Objeto de solicitud con el usuario.
   * @returns Información del usuario autenticado.
   */
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  getPerfil(@Request() req) {
    return {
      mensaje: 'Acceso permitido',
      usuario: req.user,
    };
  }

  /**
   * Crea un nuevo usuario.
   * @param dto Datos del nuevo usuario.
   * @returns Usuario creado.
   */
  @Post()
  crear(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.crear(dto);
  }

  /**
   * Devuelve todos los usuarios. Solo accesible por administradores.
   * @returns Lista de usuarios.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioService.obtenerTodos();
  }

  /**
   * Desactiva un usuario (cambia su estado a INACTIVO).
   * @param id ID del usuario a desactivar.
   * @returns Usuario desactivado.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/desactivar')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }

  /**
   * Elimina un usuario permanentemente.
   * @param id ID del usuario a eliminar.
   * @returns Resultado de la operación.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  removePermant(@Param('id') id: string) {
    return this.usuarioService.removePermant(+id);
  }

  /**
   * Actualiza los datos de un usuario.
   * @param id ID del usuario.
   * @param dto Nuevos datos del usuario.
   * @returns Usuario actualizado.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  actualizar(@Param('id') id: number, @Body() dto: UpdateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.actualizar(id, dto);
  }

  /**
   * Devuelve el perfil del usuario autenticado (versión simplificada).
   * @param req Objeto con el token JWT.
   * @returns Datos del usuario.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async obtenerMiPerfil(@Req() req: AuthRequest): Promise<Usuario> {
    const userId = req.user.id;
    return this.usuarioService.obtenerUno(userId);
  }

  /**
   * Activa un usuario (cambia su estado a ACTIVO).
   * @param id ID del usuario a activar.
   * @returns Usuario activado.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/activar')
  activar(@Param('id') id: string) {
    return this.usuarioService.activar(+id);
  }

  /**
   * Devuelve una lista paginada de usuarios.
   * Solo accesible por administradores.
   * @param page Número de página.
   * @param limit Cantidad de resultados por página.
   * @returns Objeto con usuarios, total y página actual.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('paginado')
  async obtenerPaginado(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ data: Usuario[]; total: number; page: number }> {
    return this.usuarioService.obtenerPaginado(+page, +limit);
  }
}
