import { Controller, Post, Get, Body, Param, Put, Delete, Patch, UseGuards, Request, UnauthorizedException} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './DTOs/createUsuarioDto';
import { UpdateUsuarioDto } from './DTOs/updateUsuarioDto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

//@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

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

  @Get() // Obtener todos los usuarios
  obtenerTodos(): Promise<Usuario[]> {
    
    return this.usuarioService.obtenerTodos();
  }

  
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id) // inactiva
  }
  
  
  @Put(':id') // Actualizar un usuario
  actualizar(@Param('id') id: number, @Body() dto: UpdateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.actualizar(id, dto);
  }

  @Get(':id') // Obtener 1 usuario
  async obtenerUno(@Param('id') id: number): Promise<Usuario> {
    return this.usuarioService.obtenerUno(id);
  }
  

  @Patch(':id/activar')
activar(@Param('id') id: string) {
  return this.usuarioService.activar(+id)
}




} 
