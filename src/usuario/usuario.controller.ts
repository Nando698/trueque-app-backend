import { Controller, Post, Get, Body, Param, Put, Delete, Patch, UseGuards, Request, Req, Query } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './DTOs/createUsuarioDto';
import { UpdateUsuarioDto } from './DTOs/updateUsuarioDto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthRequest } from 'src/Request/Request';


@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  getPerfil(@Request() req) {
    return {
      mensaje: 'Acceso permitido',
      usuario: req.user,
    };
  }




  @Post() // Crear un usuario
  crear(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.crear(dto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get() // Obtener todos los usuarios
  obtenerTodos(): Promise<Usuario[]> {

    return this.usuarioService.obtenerTodos();
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/desactivar')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id) // inactiva
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  removePermant(@Param('id') id: string) {
    return this.usuarioService.removePermant(+id) // elimina
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id') // Actualizar un usuario
  actualizar(@Param('id') id: number, @Body() dto: UpdateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.actualizar(id, dto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async obtenerMiPerfil(@Req() req: AuthRequest): Promise<Usuario> {
    const userId = req.user.id;
    return this.usuarioService.obtenerUno(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/activar')
  activar(@Param('id') id: string) {
    return this.usuarioService.activar(+id)
  }

  
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('paginado')
async obtenerPaginado(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
): Promise<{ data: Usuario[]; total: number; page: number }> {
  return this.usuarioService.obtenerPaginado(+page, +limit);
}




} 
