import { Test, TestingModule } from '@nestjs/testing';
import { OfrecimientosService } from './ofrecimientos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ofrecimiento } from './entities/ofrecimiento.entity';
import { Oferta, EstadoOferta } from '../oferta/entities/oferta.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('OfrecimientosService', () => {
  let service: OfrecimientosService;

  const mockOfrecimientoRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  const mockOfertaRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUsuarioRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfrecimientosService,
        { provide: getRepositoryToken(Ofrecimiento), useValue: mockOfrecimientoRepo },
        { provide: getRepositoryToken(Oferta), useValue: mockOfertaRepo },
        { provide: getRepositoryToken(Usuario), useValue: mockUsuarioRepo },
      ],
    }).compile();

    service = module.get<OfrecimientosService>(OfrecimientosService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('crear', () => {
    it('debería crear un ofrecimiento correctamente', async () => {
      const dto = { oferta_id: 1, mensaje: 'Hola, te interesa cambiar?' };
      const usuario = { id: 2 };
      const oferta = { id: 1, usuario: { id: 3 } };

      mockUsuarioRepo.findOne.mockResolvedValue(usuario);
      mockOfertaRepo.findOne.mockResolvedValue(oferta);
      mockOfrecimientoRepo.create.mockReturnValue('nuevoOfrecimiento');
      mockOfrecimientoRepo.save.mockResolvedValue('ofrecimientoGuardado');

      const result = await service.crear(dto, usuario.id);

      expect(mockUsuarioRepo.findOne).toHaveBeenCalledWith({ where: { id: usuario.id } });
      expect(mockOfertaRepo.findOne).toHaveBeenCalledWith({ where: { id: dto.oferta_id }, relations: ['usuario'] });
      expect(mockOfrecimientoRepo.create).toHaveBeenCalledWith({
        oferta,
        usuario,
        mensaje: dto.mensaje,
        estado: 'PENDIENTE',
      });
      expect(mockOfrecimientoRepo.save).toHaveBeenCalledWith('nuevoOfrecimiento');
      expect(result).toBe('ofrecimientoGuardado');
    });

    it('lanza NotFoundException si no se encuentra el usuario', async () => {
      mockUsuarioRepo.findOne.mockResolvedValue(null);

      await expect(service.crear({ oferta_id: 1, mensaje: '' }, 99)).rejects.toThrow(NotFoundException);
    });

    it('lanza ForbiddenException si intenta contraofertarse a sí mismo', async () => {
      const dto = { oferta_id: 1, mensaje: '' };
      const usuario = { id: 5 };
      const oferta = { id: 1, usuario: { id: 5 } };

      mockUsuarioRepo.findOne.mockResolvedValue(usuario);
      mockOfertaRepo.findOne.mockResolvedValue(oferta);

      await expect(service.crear(dto, 5)).rejects.toThrow(ForbiddenException);
    });
  });
});
