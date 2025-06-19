import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecoveryCode } from '../codigoRecuperacion/entities/codigo.entity';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsuarioService = {
    findByEmail: jest.fn(),
    actualizarPassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockRecoveryRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(RecoveryCode), useValue: mockRecoveryRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('validateUser', () => {
    it('debería devolver datos del usuario si las credenciales son válidas', async () => {
      const user = { id: 1, nombre: 'Juan', correo: 'a@mail.com', rol: 'USER', password: 'hashed' };

      mockUsuarioService.findByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const res = await service.validateUser('a@mail.com', '1234');
      expect(res).toEqual({
        id: 1,
        nombre: 'Juan',
        correo: 'a@mail.com',
        rol: 'USER',
      });
    });

    it('debería lanzar UnauthorizedException si la contraseña es inválida', async () => {
      mockUsuarioService.findByEmail.mockResolvedValue({ password: 'hashed' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validateUser('a@mail.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      mockUsuarioService.findByEmail.mockResolvedValue(null);
      await expect(service.validateUser('x@mail.com', '123')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('debería devolver el token y el nombre', async () => {
      const user = { id: 1, correo: 'x@mail.com', rol: 'USER', nombre: 'Juan' };
      mockJwtService.sign.mockReturnValue('jwt-token');

      const res = await service.login(user);
      expect(res).toEqual({
        access_token: 'jwt-token',
        nombre: 'Juan',
      });
    });
  });

  describe('generarCodigoRecuperacion', () => {
    it('debería guardar un código si el usuario existe', async () => {
      const correo = 'test@mail.com';
      const usuario = { id: 1, correo };
      const created = { correo, codigo: '123456' };

      mockUsuarioService.findByEmail.mockResolvedValue(usuario);
      mockRecoveryRepo.create.mockReturnValue(created);
      mockRecoveryRepo.save.mockResolvedValue(created);

      await service.generarCodigoRecuperacion(correo);
      expect(mockRecoveryRepo.create).toHaveBeenCalledWith(expect.objectContaining({ correo }));
    });

    it('debería lanzar NotFound si el correo no existe', async () => {
      mockUsuarioService.findByEmail.mockResolvedValue(null);
      await expect(service.generarCodigoRecuperacion('no@mail.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('cambiarPasswordConCodigo', () => {
    it('debería cambiar la contraseña si el código es válido', async () => {
      const correo = 'test@mail.com';
      const codigo = '123456';
      const recovery = { id: 10, correo, codigo };

      mockRecoveryRepo.findOne.mockResolvedValue(recovery);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
      mockRecoveryRepo.delete.mockResolvedValue(true);

      await service.cambiarPasswordConCodigo(correo, codigo, 'nueva');
      expect(mockUsuarioService.actualizarPassword).toHaveBeenCalledWith(correo, 'hashed');
      expect(mockRecoveryRepo.delete).toHaveBeenCalledWith({ id: 10 });
    });

    it('debería lanzar Unauthorized si el código es inválido', async () => {
      mockRecoveryRepo.findOne.mockResolvedValue(null);
      await expect(service.cambiarPasswordConCodigo('a@mail.com', '000000', '1234')).rejects.toThrow(UnauthorizedException);
    });
  });
});
