import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async crear(usuarioData: Partial<Usuario>): Promise<Usuario> {
    const nuevoUsuario = this.usuarioRepo.create({
      ...usuarioData,
      fechaCreacion: new Date(),
    });
    return this.usuarioRepo.save(nuevoUsuario);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioRepo.find();
  }
}
