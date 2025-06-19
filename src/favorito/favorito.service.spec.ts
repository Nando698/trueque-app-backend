import { Test, TestingModule } from '@nestjs/testing';
import { FavoritoService } from './favorito.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorito } from './entities/favorito.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Oferta } from 'src/oferta/entities/oferta.entity';
import { NotFoundException } from '@nestjs/common';

describe('FavoritoService', () => {
  let service: FavoritoService;

  const mockFavoritoRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockUsuarioRepo = {
    findOneBy: jest.fn(),
  };

  const mockOfertaRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritoService,
        { provide: getRepositoryToken(Favorito), useValue: mockFavoritoRepo },
        { provide: getRepositoryToken(Usuario), useValue: mockUsuarioRepo },
        { provide: getRepositoryToken(Oferta), useValue: mockOfertaRepo },
      ],
    }).compile();

    service = module.get<FavoritoService>(FavoritoService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('agregarFavorito', () => {
    it('debería agregar un favorito si usuario y oferta existen y no está repetido', async () => {
      const usuario = { id: 1 };
      const oferta = { id: 2 };
      const favoritoMock = { id: 10 };

      mockUsuarioRepo.findOneBy.mockResolvedValue(usuario);
      mockOfertaRepo.findOneBy.mockResolvedValue(oferta);
      mockFavoritoRepo.findOne.mockResolvedValue(null);
      mockFavoritoRepo.create.mockReturnValue(favoritoMock);
      mockFavoritoRepo.save.mockResolvedValue(favoritoMock);

      const res = await service.agregarFavorito(1, 2);
      expect(res).toEqual({ message: 'Agregado a favoritos' });
    });

    it('debería devolver mensaje si ya estaba en favoritos', async () => {
      mockUsuarioRepo.findOneBy.mockResolvedValue({ id: 1 });
      mockOfertaRepo.findOneBy.mockResolvedValue({ id: 2 });
      mockFavoritoRepo.findOne.mockResolvedValue({ id: 99 });

      const res = await service.agregarFavorito(1, 2);
      expect(res).toEqual({ message: 'Ya está en favoritos' });
    });

    it('debería lanzar NotFound si usuario u oferta no existen', async () => {
      mockUsuarioRepo.findOneBy.mockResolvedValue(null);
      mockOfertaRepo.findOneBy.mockResolvedValue(null);

      await expect(service.agregarFavorito(1, 2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('listarFavoritosDeUsuario', () => {
    it('debería devolver lista de ofertas favoritas del usuario', async () => {
      mockFavoritoRepo.find.mockResolvedValue([
        { oferta: { id: 1 } },
        { oferta: { id: 2 } },
      ]);

      const res = await service.listarFavoritosDeUsuario(1);
      expect(res).toEqual([{ id: 1 }, { id: 2 }]);
      expect(mockFavoritoRepo.find).toHaveBeenCalledWith({
        where: { usuario: { id: 1 } },
        relations: ['oferta', 'oferta.categoria'],
      });
    });
  });

  describe('eliminarFavorito', () => {
    it('debería eliminar el favorito si existe', async () => {
      const fav = { id: 1 };
      mockFavoritoRepo.findOne.mockResolvedValue(fav);
      mockFavoritoRepo.remove.mockResolvedValue(fav);

      const res = await service.eliminarFavorito(1, 2);
      expect(res).toEqual({ message: 'Favorito eliminado' });
      expect(mockFavoritoRepo.remove).toHaveBeenCalledWith(fav);
    });

    it('debería lanzar NotFound si el favorito no existe', async () => {
      mockFavoritoRepo.findOne.mockResolvedValue(null);

      await expect(service.eliminarFavorito(1, 2)).rejects.toThrow(NotFoundException);
    });
  });
});
