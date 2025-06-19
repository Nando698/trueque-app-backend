import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './DTOs/createCatDto';
import { UpdateCategoriaDto } from './DTOs/updateCatDto';
import { BadRequestException } from '@nestjs/common';

describe('CategoriaController', () => {
  let controller: CategoriaController;
  let service: CategoriaService;

  const mockCategoriaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        { provide: CategoriaService, useValue: mockCategoriaService },
      ],
    }).compile();

    controller = module.get<CategoriaController>(CategoriaController);
    service = module.get<CategoriaService>(CategoriaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a category', async () => {
    const dto: CreateCategoriaDto = { nombre: 'Ropa' };
    const result = { id: 1, ...dto };

    mockCategoriaService.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all categories', async () => {
    const result = [{ id: 1, nombre: 'Ropa' }];
    mockCategoriaService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
  });

  it('should return a single category', async () => {
    const result = { id: 1, nombre: 'Ropa' };
    mockCategoriaService.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toEqual(result);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a category', async () => {
    const dto: UpdateCategoriaDto = { nombre: 'Electrónica' };
    const result = { id: 1, nombre: 'Electrónica' };

    mockCategoriaService.update.mockResolvedValue(result);

    expect(await controller.update('1', dto)).toEqual(result);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a category successfully', async () => {
    const result = { message: 'Eliminada' };
    mockCategoriaService.remove.mockResolvedValue(result);

    expect(await controller.remove('1')).toEqual(result);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should throw BadRequestException when remove fails', async () => {
    mockCategoriaService.remove.mockRejectedValue(new Error('FK constraint'));

    await expect(controller.remove('1')).rejects.toThrow(BadRequestException);
  });
});
