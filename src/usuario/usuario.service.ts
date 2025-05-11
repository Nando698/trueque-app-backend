import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, EstadoUsuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './DTOs/updateUsuarioDto';
import { CreateUsuarioDto } from './DTOs/createUsuarioDto';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsuarioService {
  private readonly repo: Repository<Usuario>
  
  async actualizar(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    Object.assign(usuario, dto);
    return this.usuarioRepo.save(usuario);
  }
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async crear(dto: CreateUsuarioDto): Promise<Usuario> {
    
    const saltRounds = 10;
    const hash = await bcrypt.hash(dto.password, saltRounds);

    
    const usuario = this.usuarioRepo.create({
      ...dto,
      password: hash,           
      fechaCreacion: new Date(),
    });

    
    return this.usuarioRepo.save(usuario);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioRepo.find();
  }

  async obtenerUno(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no existe`);
    }
    return usuario!; 
  }  

  
  async remove(id: number) {
    await this.usuarioRepo.update(id, { estado: EstadoUsuario.INACTIVO })
    return { mensaje: `Usuario ${id} marcado como INACTIVO` }
  }


  async activar(id: number) {
    await this.usuarioRepo.update(id, { estado: EstadoUsuario.ACTIVO })
    return { mensaje: `Usuario ${id} reactivado` }
  }

  }

