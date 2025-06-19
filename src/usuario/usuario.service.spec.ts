import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario, EstadoUsuario } from './entities/usuario.entity';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsuarioService', () => {
  let service: UsuarioService;

  const mockRepo = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: getRepositoryToken(Usuario), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería crear un usuario con contraseña hasheada', async () => {
    const dto = { nombre: 'Juan', correo: 'juan@mail.com', password: '1234' };
    const mockUsuario = { id: 1, ...dto };

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed123' as never);
    mockRepo.create.mockReturnValue(mockUsuario);
    mockRepo.save.mockResolvedValue(mockUsuario);

    const res = await service.crear(dto as any);
    expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
    expect(res).toBe(mockUsuario);
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Juan',
      password: 'hashed123',
    }));
  });

  it('debería devolver todos los usuarios', async () => {
    mockRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = await service.obtenerTodos();
    expect(res.length).toBe(2);
  });

  it('debería obtener un usuario por ID', async () => {
    const usuario = { id: 1 };
    mockRepo.findOne.mockResolvedValue(usuario);
    const res = await service.obtenerUno(1);
    expect(res).toBe(usuario);
  });

  it('debería lanzar NotFound si el usuario no existe al buscar por ID', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.obtenerUno(1)).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un usuario existente', async () => {
    const dto = { nombre: 'Nuevo' };
    const usuario = { id: 1, nombre: 'Viejo' };
    mockRepo.findOneBy.mockResolvedValue(usuario);
    mockRepo.save.mockResolvedValue({ ...usuario, ...dto });

    const res = await service.actualizar(1, dto as any);
    expect(res.nombre).toBe('Nuevo');
  });

  it('debería lanzar NotFound al actualizar si no existe', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    await expect(service.actualizar(1, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('debería desactivar un usuario', async () => {
    const res = await service.remove(5);
    expect(mockRepo.update).toHaveBeenCalledWith(5, { estado: EstadoUsuario.INACTIVO });
    expect(res).toEqual({ mensaje: `Usuario 5 marcado como INACTIVO` });
  });

  it('debería eliminar un usuario permanentemente', async () => {
    const res = await service.removePermant(5);
    expect(mockRepo.delete).toHaveBeenCalledWith(5);
    expect(res).toEqual({ mensaje: `Usuario 5 eliminado` });
  });

  it('debería activar un usuario', async () => {
    const res = await service.activar(7);
    expect(mockRepo.update).toHaveBeenCalledWith(7, { estado: EstadoUsuario.ACTIVO });
    expect(res).toEqual({ mensaje: `Usuario 7 reactivado` });
  });

  it('debería buscar un usuario por email', async () => {
    const usuario = { id: 1, correo: 'test@mail.com' };
    mockRepo.findOne.mockResolvedValue(usuario);
    const res = await service.findByEmail('test@mail.com');
    expect(res).toBe(usuario);
  });

  it('debería actualizar el password por correo', async () => {
    const user = { id: 1, correo: 'x@mail.com', password: 'old' };
    mockRepo.findOneBy.mockResolvedValue(user);
    mockRepo.save.mockResolvedValue({ ...user, password: 'nuevo' });

    const res = await service.actualizarPassword('x@mail.com', 'nuevo');
    expect(res.password).toBe('nuevo');
  });

  it('debería lanzar error al cambiar password si no existe usuario', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    await expect(service.actualizarPassword('noexiste@mail.com', '123')).rejects.toThrow(NotFoundException);
  });

  it('debería devolver usuarios paginados', async () => {
    mockRepo.findAndCount.mockResolvedValue([[{ id: 1 }, { id: 2 }], 10]);

    const res = await service.obtenerPaginado(1, 2);
    expect(res).toEqual({ data: [{ id: 1 }, { id: 2 }], total: 10, page: 1 });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 2,
      order: { id: 'ASC' },
    });
  });
});
