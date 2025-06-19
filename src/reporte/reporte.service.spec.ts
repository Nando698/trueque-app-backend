import { Test, TestingModule } from '@nestjs/testing';
import { ReporteOfertaService } from './reporte.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReporteOferta } from './entities/reporte.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Oferta } from '../oferta/entities/oferta.entity';
import { NotFoundException } from '@nestjs/common';

describe('ReporteOfertaService', () => {
  let service: ReporteOfertaService;

  const mockReporteRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockUsuarioRepo = {
    findOne: jest.fn(),
  };

  const mockOfertaRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReporteOfertaService,
        { provide: getRepositoryToken(ReporteOferta), useValue: mockReporteRepo },
        { provide: getRepositoryToken(Usuario), useValue: mockUsuarioRepo },
        { provide: getRepositoryToken(Oferta), useValue: mockOfertaRepo },
      ],
    }).compile();

    service = module.get<ReporteOfertaService>(ReporteOfertaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('crear', () => {
    it('debería crear un reporte si usuario y oferta existen', async () => {
      const dto = { oferta_id: 1, motivo: 'Motivo de prueba' };
      const usuario = { id: 42 };
      const oferta = { id: 1 };
      const reporteMock = { id: 999 };

      mockUsuarioRepo.findOne.mockResolvedValue(usuario);
      mockOfertaRepo.findOne.mockResolvedValue(oferta);
      mockReporteRepo.create.mockReturnValue(reporteMock);
      mockReporteRepo.save.mockResolvedValue(reporteMock);

      const res = await service.crear(dto, 42);
      expect(res).toBe(reporteMock);
      expect(mockReporteRepo.create).toHaveBeenCalledWith({
        usuario,
        oferta,
        motivo: dto.motivo,
      });
    });

    it('debería lanzar NotFound si usuario u oferta no existen', async () => {
      mockUsuarioRepo.findOne.mockResolvedValue(null);
      mockOfertaRepo.findOne.mockResolvedValue(null);

      await expect(service.crear({ oferta_id: 1, motivo: 'algo' }, 42))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debería devolver todos los reportes', async () => {
      const reportes = [{ id: 1 }, { id: 2 }];
      mockReporteRepo.find.mockResolvedValue(reportes);

      const res = await service.findAll();
      expect(res).toEqual(reportes);
      expect(mockReporteRepo.find).toHaveBeenCalledWith({
        order: { fechaReporte: 'DESC' },
      });
    });
  });

  describe('findByOferta', () => {
    it('debería devolver reportes de una oferta específica', async () => {
      const reportes = [{ id: 1 }, { id: 2 }];
      mockReporteRepo.find.mockResolvedValue(reportes);

      const res = await service.findByOferta(5);
      expect(res).toEqual(reportes);
      expect(mockReporteRepo.find).toHaveBeenCalledWith({
        where: { oferta: { id: 5 } },
      });
    });
  });
});
