import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuarioService } from '../usuario/usuario.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecoveryCode } from 'src/codigoRecuperacion/entities/codigo.entity';

/**
 * Servicio encargado de la lógica de autenticación y recuperación de contraseña.
 */
@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    @InjectRepository(RecoveryCode)
    private readonly recoveryRepo: Repository<RecoveryCode>,
  ) {}

  /**
   * Valida las credenciales de un usuario.
   *
   * @param correo - Correo electrónico del usuario.
   * @param password - Contraseña ingresada.
   * @returns Información del usuario si es válido.
   * @throws UnauthorizedException si las credenciales no son válidas o el usuario está inactivo.
   */
  async validateUser(correo: string, password: string): Promise<any> {
    const user = await this.usuarioService.findByEmail(correo);

    if (user?.estado === "INACTIVO") {
      throw new UnauthorizedException('Usuario inactivo');
    }

    if (user && await bcrypt.compare(password, user.password)) {
      return {
        nombre: user.nombre,
        id: user.id,
        correo: user.correo,
        rol: user.rol,
      };
    }

    throw new UnauthorizedException('Credenciales inválidas');
  }

  /**
   * Genera un JWT para un usuario autenticado.
   *
   * @param user - Objeto con la información del usuario autenticado.
   * @returns Objeto con el token de acceso y el nombre del usuario.
   */
  async login(user: any) {
    const payload = { correo: user.correo, sub: user.id, rol: user.rol, nombre: user.nombre };
    return {
      access_token: this.jwtService.sign(payload),
      nombre: user.nombre
    };
  }

  /**
   * Genera un código de recuperación para restablecer contraseña.
   *
   * @param correo - Correo del usuario que solicita recuperación.
   * @throws NotFoundException si el correo no está registrado.
   */
  async generarCodigoRecuperacion(correo: string): Promise<void> {
    const usuario = await this.usuarioService.findByEmail(correo);
    if (!usuario) throw new NotFoundException('Correo no registrado');

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Código para ${correo}: ${codigo}`);

    const recoveryCode = this.recoveryRepo.create({ correo, codigo });
    await this.recoveryRepo.save(recoveryCode);
  }

  /**
   * Cambia la contraseña del usuario si el código de recuperación es válido.
   *
   * @param correo - Correo del usuario.
   * @param codigo - Código recibido para validar la operación.
   * @param nuevaPass - Nueva contraseña.
   * @throws UnauthorizedException si el código no es válido.
   */
  async cambiarPasswordConCodigo(correo: string, codigo: string, nuevaPass: string): Promise<void> {
    const recovery = await this.recoveryRepo.findOne({ where: { correo, codigo } });
    if (!recovery) throw new UnauthorizedException('Código inválido');

    const hash = await bcrypt.hash(nuevaPass, 10);
    await this.usuarioService.actualizarPassword(correo, hash);
    await this.recoveryRepo.delete({ id: recovery.id });
  }
}
