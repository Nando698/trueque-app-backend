import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'tpProgramacion3', 
    });
  }

  async validate(payload: any) {
    const id = Number(payload.sub);
  if (isNaN(id)) {
    throw new UnauthorizedException('Token inválido');
  }

  return { id, correo: payload.correo, rol: payload.rol };
  }
}
