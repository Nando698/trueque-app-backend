import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  crear(@Body() datos: Partial<Usuario>): Promise<Usuario> {
    return this.usuarioService.crear(datos);
  }

  @Get()
  obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioService.obtenerTodos();
  }
}
