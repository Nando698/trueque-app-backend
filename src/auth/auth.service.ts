import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuarioService } from '../usuario/usuario.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecoveryCode } from 'src/codigoRecuperacion/entities/codigo.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    @InjectRepository(RecoveryCode)
    private readonly recoveryRepo: Repository<RecoveryCode>,
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
}

async generarCodigoRecuperacion(correo: string): Promise<void> {
  const usuario = await this.usuarioService.findByEmail(correo);
  if (!usuario) throw new NotFoundException('Correo no registrado');

  const codigo = Math.floor(100000 + Math.random() * 900000).toString(); 
  console.log(`Código para ${correo}: ${codigo}`);

  const recoveryCode = this.recoveryRepo.create({ correo, codigo });
  await this.recoveryRepo.save(recoveryCode);
}

async cambiarPasswordConCodigo(correo: string, codigo: string, nuevaPass: string): Promise<void> {
  const recovery = await this.recoveryRepo.findOne({ where: { correo, codigo } });
  if (!recovery) throw new UnauthorizedException('Código inválido');

  const hash = await bcrypt.hash(nuevaPass, 10);
  await this.usuarioService.actualizarPassword(correo, hash);
  await this.recoveryRepo.delete({ id: recovery.id }); 
}










}
