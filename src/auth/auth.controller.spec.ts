import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    generarCodigoRecuperacion: jest.fn(),
    cambiarPasswordConCodigo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        Reflector, // necesario si usás guards con metadata
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('debería devolver token si login es correcto', async () => {
      const loginData = { correo: 'a@mail.com', password: '1234' };
      const user = { id: 1, correo: loginData.correo };
      const token = { access_token: 'abc123', nombre: 'Juan' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(token);

      const res = await controller.login(loginData);
      expect(res).toEqual(token);
      expect(service.validateUser).toHaveBeenCalledWith('a@mail.com', '1234');
      expect(service.login).toHaveBeenCalledWith(user);
    });
  });

  describe('validateToken', () => {
    it('debería devolver true si el token es válido', () => {
      expect(controller.validateToken()).toBe(true);
    });
  });

  describe('solicitarCodigo', () => {
    it('debería llamar al servicio para generar código', async () => {
      mockAuthService.generarCodigoRecuperacion.mockResolvedValue(undefined);
      const res = await controller.solicitarCodigo('correo@mail.com');
      expect(res).toBeUndefined();
      expect(service.generarCodigoRecuperacion).toHaveBeenCalledWith('correo@mail.com');
    });
  });

  describe('resetPassword', () => {
    it('debería llamar al servicio para cambiar la contraseña', async () => {
      const body = {
        correo: 'correo@mail.com',
        codigo: '123456',
        nuevaPass: 'nueva',
      };

      mockAuthService.cambiarPasswordConCodigo.mockResolvedValue(undefined);
      const res = await controller.resetPassword(body);
      expect(res).toBeUndefined();
      expect(service.cambiarPasswordConCodigo).toHaveBeenCalledWith(
        body.correo,
        body.codigo,
        body.nuevaPass
      );
    });
  });
});
