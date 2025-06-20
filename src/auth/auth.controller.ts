import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Controlador de autenticación que maneja login, validación de token
 * y recuperación de contraseña.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Autentica al usuario con su correo y contraseña.
   * 
   * @param body - Objeto con correo y password.
   * @returns JWT si las credenciales son válidas.
   */
  @Post('login')
  async login(@Body() body: { correo: string; password: string }) {
    const user = await this.authService.validateUser(body.correo, body.password);
    return this.authService.login(user);
  }

  /**
   * Verifica que el token JWT recibido sea válido.
   * 
   * @returns `true` si el token es válido.
   */
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validateToken() {
    return true;
  }

  /**
   * Solicita un código de recuperación de contraseña enviado por email.
   * 
   * @param correo - Correo del usuario que desea recuperar su cuenta.
   * @returns Mensaje de éxito si el código fue generado correctamente.
   */
  @Post('recovery')
  async solicitarCodigo(@Body('correo') correo: string) {
    return this.authService.generarCodigoRecuperacion(correo);
  }

  /**
   * Restablece la contraseña usando un código de recuperación válido.
   * 
   * @param body - Objeto con correo, código y nueva contraseña.
   * @returns Resultado de la operación de cambio de contraseña.
   */
  @Post('reset-password')
  async resetPassword(
    @Body() body: { correo: string; codigo: string; nuevaPass: string },
  ) {
    const { correo, codigo, nuevaPass } = body;
    return this.authService.cambiarPasswordConCodigo(correo, codigo, nuevaPass);
  }
}
