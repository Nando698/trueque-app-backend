import { Controller, Post, Get, Body, Param, Put } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './DTOs/createUsuarioDto';
import { UpdateUsuarioDto } from './DTOs/updateUsuarioDto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  crear(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.crear(dto);
  }

  @Get()
  obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioService.obtenerTodos();
  }

  @Put(':id')
  actualizar(@Param('id') id: number, @Body() dto: UpdateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.actualizar(id, dto);
  }

  @Get(':id')
  async obtenerUno(@Param('id') id: number): Promise<Usuario> {
    return this.usuarioService.obtenerUno(id);
  }
}
