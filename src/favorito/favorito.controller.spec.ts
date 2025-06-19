import { Test, TestingModule } from '@nestjs/testing';
import { FavoritoController } from './favorito.controller';
import { FavoritoService } from './favorito.service';
import { AuthRequest } from 'src/Request/Request';

describe('FavoritoController', () => {
  let controller: FavoritoController;
  let service: FavoritoService;

  const mockFavoritoService = {
    agregarFavorito: jest.fn(),
    listarFavoritosDeUsuario: jest.fn(),
    eliminarFavorito: jest.fn(),
  };

  const mockReq = {
    user: { id: 42 },
  } as AuthRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritoController],
      providers: [
        { provide: FavoritoService, useValue: mockFavoritoService },
      ],
    }).compile();

    controller = module.get<FavoritoController>(FavoritoController);
    service = module.get<FavoritoService>(FavoritoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería agregar un favorito', async () => {
    const ofertaId = 10;
    const result = { mensaje: 'Agregado' };
    mockFavoritoService.agregarFavorito.mockResolvedValue(result);

    const respuesta = await controller.agregar(ofertaId, mockReq);

    expect(respuesta).toEqual(result);
    expect(service.agregarFavorito).toHaveBeenCalledWith(42, ofertaId);
  });

  it('debería obtener los favoritos del usuario', async () => {
    const favoritos = [{ ofertaId: 10 }, { ofertaId: 11 }];
    mockFavoritoService.listarFavoritosDeUsuario.mockResolvedValue(favoritos);

    const respuesta = await controller.obtenerFavoritos(mockReq);

    expect(respuesta).toEqual(favoritos);
    expect(service.listarFavoritosDeUsuario).toHaveBeenCalledWith(42);
  });

  it('debería eliminar un favorito', async () => {
    const ofertaId = 10;
    const result = { mensaje: 'Eliminado' };
    mockFavoritoService.eliminarFavorito.mockResolvedValue(result);

    const respuesta = await controller.eliminar(ofertaId, mockReq);

    expect(respuesta).toEqual(result);
    expect(service.eliminarFavorito).toHaveBeenCalledWith(42, ofertaId);
  });
});
