import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { correo: string; password: string }) {
    const user = await this.authService.validateUser(body.correo, body.password);
    return this.authService.login(user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validateToken() {
    return true;
  }
  
  
  @Post('recovery')
  async solicitarCodigo(@Body('correo') correo: string) {
    return this.authService.generarCodigoRecuperacion(correo);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { correo: string; codigo: string; nuevaPass: string },
  ) {
    const { correo, codigo, nuevaPass } = body;
    return this.authService.cambiarPasswordConCodigo(correo, codigo, nuevaPass);
  }
}
  
