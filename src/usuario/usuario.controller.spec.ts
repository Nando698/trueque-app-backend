import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './DTOs/createUsuarioDto';
import { UpdateUsuarioDto } from './DTOs/updateUsuarioDto';
import { AuthRequest } from 'src/Request/Request';
import { EstadoUsuario, RolUsuario } from './entities/usuario.entity';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;

  const mockService = {
    crear: jest.fn(),
    obtenerTodos: jest.fn(),
    remove: jest.fn(),
    removePermant: jest.fn(),
    actualizar: jest.fn(),
    obtenerUno: jest.fn(),
    activar: jest.fn(),
    obtenerPaginado: jest.fn(),
  };

  const mockReq = {
    user: { id: 123 },
  } as AuthRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        { provide: UsuarioService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get<UsuarioService>(UsuarioService);
  });

  afterEach(() => jest.clearAllMocks());

  it('debería crear un usuario', async () => {
    const dto: CreateUsuarioDto = { nombre: 'Juan', correo: 'juan@mail.com', password: '1234', estado:EstadoUsuario.ACTIVO, rol:RolUsuario.NORMAL};
    const usuarioMock = { id: 1, ...dto };

    mockService.crear.mockResolvedValue(usuarioMock);

    const res = await controller.crear(dto);
    expect(res).toBe(usuarioMock);
    expect(service.crear).toHaveBeenCalledWith(dto);
  });

  it('debería obtener todos los usuarios', async () => {
    mockService.obtenerTodos.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = await controller.obtenerTodos();
    expect(res.length).toBe(2);
  });

  it('debería desactivar un usuario', async () => {
    mockService.remove.mockResolvedValue({ message: 'Desactivado' });
    const res = await controller.remove('5');
    expect(service.remove).toHaveBeenCalledWith(5);
    expect(res).toEqual({ message: 'Desactivado' });
  });

  it('debería eliminar un usuario permanentemente', async () => {
    mockService.removePermant.mockResolvedValue({ message: 'Eliminado' });
    const res = await controller.removePermant('5');
    expect(service.removePermant).toHaveBeenCalledWith(5);
    expect(res).toEqual({ message: 'Eliminado' });
  });

  it('debería actualizar un usuario', async () => {
    const dto: UpdateUsuarioDto = { nombre: 'Nuevo' };
    const resMock = { id: 1, nombre: 'Nuevo' };
    mockService.actualizar.mockResolvedValue(resMock);

    const res = await controller.actualizar(1, dto);
    expect(service.actualizar).toHaveBeenCalledWith(1, dto);
    expect(res).toBe(resMock);
  });

  it('debería devolver su propio perfil', async () => {
    const user = { id: 123, nombre: 'Pepe' };
    mockService.obtenerUno.mockResolvedValue(user);

    const res = await controller.obtenerMiPerfil(mockReq);
    expect(res).toBe(user);
    expect(service.obtenerUno).toHaveBeenCalledWith(123);
  });

  it('debería activar un usuario', async () => {
    mockService.activar.mockResolvedValue({ message: 'Activado' });
    const res = await controller.activar('3');
    expect(service.activar).toHaveBeenCalledWith(3);
    expect(res).toEqual({ message: 'Activado' });
  });

  it('debería devolver datos paginados', async () => {
    const mockPaginated = {
      data: [{ id: 1 }, { id: 2 }],
      total: 2,
      page: 1,
    };

    mockService.obtenerPaginado.mockResolvedValue(mockPaginated);

    const res = await controller.obtenerPaginado(1, 10);
    expect(res).toBe(mockPaginated);
    expect(service.obtenerPaginado).toHaveBeenCalledWith(1, 10);
  });

  it('debería devolver el perfil usando el decorador @Request', async () => {
    const req = { user: { id: 10, nombre: 'Carlos' } };
    const res = controller.getPerfil(req as any);
    expect(res).toEqual({
      mensaje: 'Acceso permitido',
      usuario: req.user,
    });
  });
});
