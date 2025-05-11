import { Controller, Post, Get, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './DTOs/createUsuarioDto';
import { UpdateUsuarioDto } from './DTOs/updateUsuarioDto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post() // Crear un usuario
  crear(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.crear(dto);
  }

  @Get() // Obtener todos los usuarios
  obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioService.obtenerTodos();
  }

  @Put(':id') // Actualizar un usuario
  actualizar(@Param('id') id: number, @Body() dto: UpdateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.actualizar(id, dto);
  }

  @Get(':id') // Obtener 1 usuario
  async obtenerUno(@Param('id') id: number): Promise<Usuario> {
    return this.usuarioService.obtenerUno(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id) // inactiva
  }

  @Patch(':id/activar')
activar(@Param('id') id: string) {
  return this.usuarioService.activar(+id)
}
} 
