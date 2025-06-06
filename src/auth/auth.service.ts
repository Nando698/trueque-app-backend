import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(correo: string, password: string): Promise<any> {
  const user = await this.usuarioService.findByEmail(correo);

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

  async login(user: any) {
  console.log("user que llega a login:", user);
  const payload = { correo: user.correo, sub: user.id, rol: user.rol, nombre: user.nombre };
  console.log("payload que se firma:", payload);
  return {
    access_token: this.jwtService.sign(payload),
    nombre : user.nombre   
}
}}
