import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';





@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

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