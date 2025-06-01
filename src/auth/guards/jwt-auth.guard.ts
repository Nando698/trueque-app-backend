import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('JwtAuthGuard -> user:', user);
    if (err || !user) {
      
      throw new UnauthorizedException('No autorizado o token inválido');
    }
    return user;
  }
}
