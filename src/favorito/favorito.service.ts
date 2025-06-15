import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Favorito } from './entities/favorito.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Oferta } from 'src/oferta/entities/oferta.entity';

@Injectable()
export class FavoritoService {
  constructor(
    @InjectRepository(Favorito)
    private favoritoRepo: Repository<Favorito>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,

    @InjectRepository(Oferta)
    private ofertaRepo: Repository<Oferta>,
  ) {}

  // Agrega una oferta a los favoritos del usuario
  async agregarFavorito(usuarioId: number, ofertaId: number) {
    const usuario = await this.usuarioRepo.findOneBy({ id: usuarioId });
    const oferta = await this.ofertaRepo.findOneBy({ id: ofertaId });

    if (!usuario || !oferta) {
      throw new NotFoundException('Usuario u oferta no encontrados');
    }

    const yaExiste = await this.favoritoRepo.findOne({
      where: {
        usuario: { id: usuarioId },
        oferta: { id: ofertaId },
      },
    });

    if (yaExiste) {
      return { message: 'Ya está en favoritos' };
    }

    const favorito = this.favoritoRepo.create({ usuario, oferta });
    await this.favoritoRepo.save(favorito);

    return { message: 'Agregado a favoritos' };
  }

  // (Opcional) Listar los favoritos de un usuario
  async listarFavoritosDeUsuario(usuarioId: number) {
    const favoritos = await this.favoritoRepo.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: ['oferta', 'oferta.categoria'],
    });
  
    return favoritos.map(f => f.oferta);
  }

  // (Opcional) Eliminar un favorito
  async eliminarFavorito(usuarioId: number, ofertaId: number) {
    const favorito = await this.favoritoRepo.findOne({
      where: {
        usuario: { id: usuarioId },
        oferta: { id: ofertaId },
      },
    });

    if (!favorito) {
      throw new NotFoundException('Favorito no encontrado');
    }

    await this.favoritoRepo.remove(favorito);
    return { message: 'Favorito eliminado' };
  }
}
