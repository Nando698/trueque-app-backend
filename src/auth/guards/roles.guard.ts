import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard que restringe el acceso a rutas para usuarios con rol ADMIN.
 * 
 * Verifica que el usuario autenticado tenga el rol adecuado antes de permitir el acceso.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Método que determina si el usuario puede acceder a la ruta protegida.
   *
   * @param context - El contexto de ejecución actual (HTTP, RPC, WebSocket, etc.).
   * @returns `true` si el usuario tiene el rol ADMIN; de lo contrario, lanza una excepción.
   * @throws ForbiddenException si el usuario no tiene el rol requerido.
   */
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    console.log('RolesGuard -> user:', user);

    if (!user || user.rol !== 'ADMIN') {
      throw new ForbiddenException('Acceso restringido a administradores');
    }

    return true;
  }
}
