import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que verifica la validez del token JWT.
 * 
 * Extiende el guard de Passport para manejar la autenticación mediante estrategia JWT.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Maneja el resultado de la autenticación.
   * 
   * @param err - Error de autenticación, si lo hay.
   * @param user - Usuario autenticado (si corresponde).
   * @param info - Información adicional del proceso de autenticación.
   * @param context - Contexto de ejecución (generalmente HTTP).
   * @returns El usuario si está autenticado correctamente.
   * @throws UnauthorizedException si no hay usuario válido o hay un error.
   */
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('JwtAuthGuard -> user:', user);

    if (err || !user) {
      throw new UnauthorizedException('No autorizado o token inválido');
    }

    return user;
  }
}

