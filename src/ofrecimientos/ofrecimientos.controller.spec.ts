import { Test, TestingModule } from '@nestjs/testing';
import { OfrecimientosController } from './ofrecimientos.controller';
import { OfrecimientosService } from './ofrecimientos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('OfrecimientosController', () => {
  let controller: OfrecimientosController;
  let service: OfrecimientosService;

  const mockService = {
    crear: jest.fn(),
    obtenerRecibidos: jest.fn(),
    obtenerEnviados: jest.fn(),
    aceptar: jest.fn(),
    rechazar: jest.fn(),
  };

  const mockReq = { user: { id: 123 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfrecimientosController],
      providers: [
        { provide: OfrecimientosService, useValue: mockService },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true }) // Desactiva el guard para pruebas
    .compile();

    controller = module.get<OfrecimientosController>(OfrecimientosController);
    service = module.get<OfrecimientosService>(OfrecimientosService);
  });

  it('debería crear un ofrecimiento', async () => {
    const dto = { mensaje: 'te ofrezco esto', oferta_id: 1 };
    await controller.crear(dto as any, mockReq as any);
    expect(mockService.crear).toHaveBeenCalledWith(dto, 123);
  });

  it('debería obtener ofrecimientos recibidos', async () => {
    await controller.recibidos(mockReq as any);
    expect(mockService.obtenerRecibidos).toHaveBeenCalledWith(123);
  });

  it('debería obtener ofrecimientos enviados', async () => {
    await controller.enviados(mockReq as any);
    expect(mockService.obtenerEnviados).toHaveBeenCalledWith(123);
  });

  it('debería aceptar un ofrecimiento', async () => {
    await controller.aceptar('42', mockReq as any);
    expect(mockService.aceptar).toHaveBeenCalledWith(42, 123);
  });

  it('debería rechazar un ofrecimiento', async () => {
    await controller.rechazar('55', mockReq as any);
    expect(mockService.rechazar).toHaveBeenCalledWith(55, 123);
  });
});
