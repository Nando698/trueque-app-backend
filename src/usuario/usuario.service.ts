import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, EstadoUsuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './DTOs/updateUsuarioDto';
import { CreateUsuarioDto } from './DTOs/createUsuarioDto';
import * as bcrypt from 'bcrypt';

/**
 * Servicio que maneja la lógica de negocio para los usuarios.
 */
@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  /**
   * Crea un nuevo usuario con su contraseña encriptada.
   * @param dto Datos para crear el usuario.
   * @returns Usuario creado.
   */
  async crear(dto: CreateUsuarioDto): Promise<Usuario> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(dto.password, saltRounds);

    const usuario = this.usuarioRepo.create({
      ...dto,
      password: hash,
      fechaCreacion: new Date(),
    });

    console.log("usuario creado: ", usuario);

    return this.usuarioRepo.save(usuario);
  }

  /**
   * Devuelve todos los usuarios de la base de datos.
   * @returns Lista de usuarios.
   */
  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioRepo.find();
  }

  /**
   * Devuelve un usuario por ID.
   * @param id ID del usuario.
   * @returns Usuario encontrado.
   * @throws NotFoundException si no existe el usuario.
   */
  async obtenerUno(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no existe`);
    }
    return usuario!;
  }

  /**
   * Actualiza los datos de un usuario.
   * @param id ID del usuario.
   * @param dto Nuevos datos del usuario.
   * @returns Usuario actualizado.
   */
  async actualizar(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    Object.assign(usuario, dto);
    return this.usuarioRepo.save(usuario);
  }

  /**
   * Marca un usuario como INACTIVO.
   * @param id ID del usuario.
   * @returns Mensaje de confirmación.
   */
  async remove(id: number) {
    await this.usuarioRepo.update(id, { estado: EstadoUsuario.INACTIVO });
    return { mensaje: `Usuario ${id} marcado como INACTIVO` };
  }

  /**
   * Elimina un usuario de forma permanente.
   * @param id ID del usuario.
   * @returns Mensaje de confirmación.
   */
  async removePermant(id: number) {
    await this.usuarioRepo.delete(id);
    return { mensaje: `Usuario ${id} eliminado` };
  }

  /**
   * Reactiva un usuario marcándolo como ACTIVO.
   * @param id ID del usuario.
   * @returns Mensaje de confirmación.
   */
  async activar(id: number) {
    await this.usuarioRepo.update(id, { estado: EstadoUsuario.ACTIVO });
    return { mensaje: `Usuario ${id} reactivado` };
  }

  /**
   * Busca un usuario por su correo electrónico.
   * @param correo Correo del usuario.
   * @returns Usuario encontrado o null.
   */
  async findByEmail(correo: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { correo } });
  }

  /**
   * Actualiza la contraseña de un usuario.
   * @param correo Correo del usuario.
   * @param nuevaPasswordHash Nueva contraseña ya hasheada.
   * @returns Usuario actualizado.
   * @throws NotFoundException si no existe el usuario.
   */
  async actualizarPassword(correo: string, nuevaPasswordHash: string) {
    const user = await this.usuarioRepo.findOneBy({ correo });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.password = nuevaPasswordHash;
    return this.usuarioRepo.save(user);
  }

  /**
   * Devuelve una lista paginada de usuarios.
   * @param page Número de página.
   * @param limit Cantidad de resultados por página.
   * @returns Objeto con usuarios, total y página actual.
   */
  async obtenerPaginado(page: number, limit: number): Promise<{ data: Usuario[]; total: number; page: number }> {
    const [data, total] = await this.usuarioRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    console.log({ data, total, page });

    return { data, total, page };
  }
}
