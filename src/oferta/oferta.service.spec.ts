import { Test, TestingModule } from '@nestjs/testing';
import { OfertaService } from './oferta.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Oferta, EstadoOferta } from './entities/oferta.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('OfertaService', () => {
  let service: OfertaService;

  const ofertaRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const usuarioRepo = {
    findOneBy: jest.fn(),
  };

  const categoriaRepo = {
    findOneBy: jest.fn(),
  };

  const mockQueryBuilder: any = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfertaService,
        { provide: getRepositoryToken(Oferta), useValue: ofertaRepo },
        { provide: getRepositoryToken(Usuario), useValue: usuarioRepo },
        { provide: getRepositoryToken(Categoria), useValue: categoriaRepo },
      ],
    }).compile();

    service = module.get<OfertaService>(OfertaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería crear una oferta', async () => {
    const dto = {
      titulo: 'Oferta',
      descripcion: 'Detalle',
      estado: EstadoOferta.ACTIVA,
      cambio: 'algo',
      imagenes: [],
      usuario_id: 1,
      categoria_id: 2,
    };

    usuarioRepo.findOneBy.mockResolvedValue({ id: 1 });
    categoriaRepo.findOneBy.mockResolvedValue({ id: 2 });
    const nueva = { id: 99 };
    ofertaRepo.create.mockReturnValue(nueva);
    ofertaRepo.save.mockResolvedValue(nueva);

    const res = await service.create(dto);
    expect(res).toBe(nueva);
  });

  it('debería lanzar error si usuario o categoría no existen al crear', async () => {
    usuarioRepo.findOneBy.mockResolvedValue(null);
    categoriaRepo.findOneBy.mockResolvedValue(null);

    await expect(service.create({ usuario_id: 1, categoria_id: 2 } as any)).rejects.toThrow(NotFoundException);
  });

  it('debería devolver todas las ofertas activas', async () => {
    const mockOfertas = [{ id: 1 }];
    ofertaRepo.find.mockResolvedValue(mockOfertas);

    const res = await service.findAll();
    expect(res).toBe(mockOfertas);
  });

  it('debería buscar por categoría', async () => {
    const mock = [{ id: 1 }];
    ofertaRepo.find.mockResolvedValue(mock);
    const res = await service.buscarPorCategoria(5);
    expect(res).toBe(mock);
  });

  it('debería buscar por usuario con estado', async () => {
    const mock = [{ id: 1 }];
    ofertaRepo.find.mockResolvedValue(mock);
    const res = await service.buscarPorUsuario(3, EstadoOferta.PAUSADA);
    expect(res).toBe(mock);
  });

  it('debería devolver una oferta por ID', async () => {
    const oferta = { id: 1 };
    ofertaRepo.findOne.mockResolvedValue(oferta);
    const res = await service.findOne(1);
    expect(res).toBe(oferta);
  });

  it('debería actualizar una oferta', async () => {
    const old = { id: 1, titulo: 'viejo' };
    const dto = { titulo: 'nuevo' };
    ofertaRepo.findOne.mockResolvedValue(old);
    ofertaRepo.save.mockResolvedValue({ ...old, ...dto });

    const res = await service.update(1, dto as any);
    expect(res.titulo).toBe('nuevo');
  });

  it('debería lanzar error si la oferta no existe al actualizar', async () => {
    ofertaRepo.findOne.mockResolvedValue(null);
    await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('debería eliminar una oferta', async () => {
    const oferta = { id: 1 };
    ofertaRepo.findOne.mockResolvedValue(oferta);
    ofertaRepo.remove.mockResolvedValue(oferta);
    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('debería lanzar error si la oferta no existe al eliminar', async () => {
    ofertaRepo.findOne.mockResolvedValue(null);
    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('debería cambiar el estado de una oferta', async () => {
    const oferta = { id: 1, estado: EstadoOferta.ACTIVA };
    ofertaRepo.findOne.mockResolvedValue(oferta);
    ofertaRepo.save.mockResolvedValue({ ...oferta, estado: EstadoOferta.FINALIZADA });

    const res = await service.cambiarEstado(1, EstadoOferta.FINALIZADA);
    expect(res.estado).toBe(EstadoOferta.FINALIZADA);
  });

  it('debería lanzar error si la oferta no existe al cambiar estado', async () => {
    ofertaRepo.findOne.mockResolvedValue(null);
    await expect(service.cambiarEstado(1, EstadoOferta.PAUSADA)).rejects.toThrow(NotFoundException);
  });

  it('debería permitir cambio de estado si es admin o dueño', async () => {
    const oferta = { id: 1, usuario: { id: 2 } };
    ofertaRepo.findOne.mockResolvedValue(oferta);
    ofertaRepo.save.mockResolvedValue({ ...oferta, estado: EstadoOferta.PAUSADA });

    const res = await service.cambiarEstadoSiAutorizado(1, EstadoOferta.PAUSADA, 2, 'USER');
    expect(res.estado).toBe(EstadoOferta.PAUSADA);
  });

  it('debería lanzar Forbidden si no es admin ni dueño', async () => {
    const oferta = { id: 1, usuario: { id: 9 } };
    ofertaRepo.findOne.mockResolvedValue(oferta);

    await expect(
      service.cambiarEstadoSiAutorizado(1, EstadoOferta.PAUSADA, 2, 'USER')
    ).rejects.toThrow(ForbiddenException);
  });

  it('debería buscar ofertas personalizadas con filtros', async () => {
    ofertaRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const res = await service.buscarPersonalizado({
      categoriaId: '1,2',
      texto: 'guitarra',
    });

    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    expect(res).toEqual([{ id: 1 }, { id: 2 }]);
  });
});
