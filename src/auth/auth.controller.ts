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
  
  
  
}