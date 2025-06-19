import { Test, TestingModule } from '@nestjs/testing';
import { ReporteOfertaController } from './reporte.controller';
import { ReporteOfertaService } from './reporte.service';
import { CrearReporteDto } from './DTOs/reporteDto';
import { AuthRequest } from '../Request/Request';

describe('ReporteOfertaController', () => {
  let controller: ReporteOfertaController;
  let service: ReporteOfertaService;

  const mockReporteService = {
    crear: jest.fn(),
    findAll: jest.fn(),
  };

  const mockReq = {
    user: { id: 42 },
  } as AuthRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReporteOfertaController],
      providers: [
        { provide: ReporteOfertaService, useValue: mockReporteService },
      ],
    }).compile();

    controller = module.get<ReporteOfertaController>(ReporteOfertaController);
    service = module.get<ReporteOfertaService>(ReporteOfertaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería crear un reporte', async () => {
    const dto: CrearReporteDto = {
      oferta_id: 1,
      motivo: 'Contenido inapropiado',
    };

    const resultado = { mensaje: 'Reporte recibido' };

    mockReporteService.crear.mockResolvedValue(resultado);

    const respuesta = await controller.crearReporte(dto, mockReq);
    expect(respuesta).toBe(resultado);
    expect(service.crear).toHaveBeenCalledWith(dto, 42);
  });

  it('debería listar todos los reportes', async () => {
    const reportes = [{ id: 1 }, { id: 2 }];
    mockReporteService.findAll.mockResolvedValue(reportes);

    const respuesta = await controller.listarTodos();
    expect(respuesta).toEqual(reportes);
    expect(service.findAll).toHaveBeenCalled();
  });
});
