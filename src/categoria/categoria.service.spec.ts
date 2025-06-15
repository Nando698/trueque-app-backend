import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaService } from './categoria.service';
import { Categoria } from './entities/categoria.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockCategoria = { id: 1, nombre: 'Electrónica' };

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repo: jest.Mocked<Repository<Categoria>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        {
          provide: getRepositoryToken(Categoria),
          useValue: {
            create: jest.fn().mockReturnValue(mockCategoria),
            save: jest.fn().mockResolvedValue(mockCategoria),
            find: jest.fn().mockResolvedValue([mockCategoria]),
            findOneBy: jest.fn().mockResolvedValue(mockCategoria),
            update: jest.fn().mockResolvedValue(undefined),
            remove: jest.fn().mockResolvedValue(mockCategoria),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
    repo = module.get(getRepositoryToken(Categoria));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('create() debería crear y guardar una categoría', async () => {
    const dto = { nombre: 'Electrónica' };
    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(mockCategoria);
    expect(result).toEqual(mockCategoria);
  });

  it('findAll() debería devolver todas las categorías', async () => {
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([mockCategoria]);
  });

  it('findOne() debería devolver una categoría por id', async () => {
    const result = await service.findOne(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockCategoria);
  });

  it('update() debería actualizar y devolver la categoría', async () => {
    const dto = { nombre: 'Tecnología' };
    const result = await service.update(1, dto);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(mockCategoria);
  });

  it('remove() debería eliminar una categoría existente', async () => {
    const result = await service.remove(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.remove).toHaveBeenCalledWith(mockCategoria);
    expect(result).toEqual(mockCategoria);
  });

  it('remove() debería lanzar NotFoundException si no existe', async () => {
    repo.findOneBy.mockResolvedValueOnce(null);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
