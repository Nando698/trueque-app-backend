import { Test, TestingModule } from '@nestjs/testing';
import { OfertaController } from './oferta.controller';
import { OfertaService } from './oferta.service';
import { EstadoOferta } from './entities/oferta.entity';
import { AuthRequest } from 'src/Request/Request';

describe('OfertaController', () => {
  let controller: OfertaController;
  let service: OfertaService;

  const mockService = {
    create: jest.fn(),
    buscarPersonalizado: jest.fn(),
    buscarPorUsuario: jest.fn(),
    buscarPorCategoria: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    cambiarEstadoSiAutorizado: jest.fn(),
  };

  const reqMock = {
    user: { id: 1, rol: 'USER' },
  } as AuthRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfertaController],
      providers: [{ provide: OfertaService, useValue: mockService }],
    }).compile();

    controller = module.get<OfertaController>(OfertaController);
    service = module.get<OfertaService>(OfertaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería crear una oferta', async () => {
    const dto = { titulo: 'Oferta 1' };
    const files = [{ filename: 'img1.png' }] as any[];
    mockService.create.mockResolvedValue('ok');

    const res = await controller.create(files, dto as any, reqMock);
    expect(res).toBe('ok');
    expect(service.create).toHaveBeenCalled();
  });

  it('debería buscar personalizado', async () => {
    mockService.buscarPersonalizado.mockResolvedValue('res');
    const res = await controller.buscar('3', 'celu');
    expect(res).toBe('res');
    expect(service.buscarPersonalizado).toHaveBeenCalledWith({
      categoriaId: '3',
      texto: 'celu',
    });
  });

  it('debería buscar por usuario', async () => {
    mockService.buscarPorUsuario.mockResolvedValue('ok');
    const res = await controller.findAll(undefined, '2', 'ACTIVA');
    expect(res).toBe('ok');
    expect(service.buscarPorUsuario).toHaveBeenCalledWith(2, 'ACTIVA');
  });

  it('debería buscar por categoría', async () => {
    mockService.buscarPorCategoria.mockResolvedValue('ok');
    const res = await controller.findAll('5', undefined, undefined);
    expect(res).toBe('ok');
    expect(service.buscarPorCategoria).toHaveBeenCalledWith(5);
  });

  it('debería devolver todas las ofertas', async () => {
    mockService.findAll.mockResolvedValue(['todo']);
    const res = await controller.findAll();
    expect(res).toEqual(['todo']);
  });

  it('debería obtener una oferta', async () => {
    mockService.findOne.mockResolvedValue('detalle');
    const res = await controller.findOne('1');
    expect(res).toBe('detalle');
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('debería actualizar una oferta', async () => {
    mockService.update.mockResolvedValue('actualizada');
    const res = await controller.update('1', { titulo: 'nuevo' } as any);
    expect(res).toBe('actualizada');
    expect(service.update).toHaveBeenCalledWith(1, { titulo: 'nuevo' });
  });

  it('debería eliminar una oferta', async () => {
    mockService.remove.mockResolvedValue('borrada');
    const res = await controller.remove('1');
    expect(res).toBe('borrada');
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('debería pausar una oferta', async () => {
    await controller.pausar('1', reqMock);
    expect(service.cambiarEstadoSiAutorizado).toHaveBeenCalledWith(1, EstadoOferta.PAUSADA, 1, 'USER');
  });

  it('debería finalizar una oferta', async () => {
    await controller.finalizar('1', reqMock);
    expect(service.cambiarEstadoSiAutorizado).toHaveBeenCalledWith(1, EstadoOferta.FINALIZADA, 1, 'USER');
  });

  it('debería despausar una oferta', async () => {
    await controller.despausar('1', reqMock);
    expect(service.cambiarEstadoSiAutorizado).toHaveBeenCalledWith(1, EstadoOferta.ACTIVA, 1, 'USER');
  });
});
