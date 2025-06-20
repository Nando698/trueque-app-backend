import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { EstadoOfrecimiento, Ofrecimiento } from './entities/ofrecimiento.entity';
import { CreateOfrecimientoDto } from './dto/create-ofrecimiento.dto';
import { EstadoOferta, Oferta } from '../oferta/entities/oferta.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Injectable()
export class OfrecimientosService {
  constructor(
    @InjectRepository(Ofrecimiento)
    private ofrecimientoRepo: Repository<Ofrecimiento>,
    @InjectRepository(Oferta)
    private ofertaRepo: Repository<Oferta>,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async crear(dto: CreateOfrecimientoDto, usuarioId: number) {
    const usuario = await this.usuarioRepo.findOne({ where: { id: usuarioId } });
    const oferta = await this.ofertaRepo.findOne({
      where: { id: dto.oferta_id },
      relations: ['usuario'],
    });

    if (!usuario || !oferta) {
      throw new NotFoundException('Oferta o usuario no encontrado');
    }

    if (oferta.usuario.id === usuarioId) {
      throw new ForbiddenException('No podés contraofertar tu propia oferta');
    }

    const nuevo = this.ofrecimientoRepo.create({
      oferta,
      usuario,
      mensaje: dto.mensaje,
      estado: EstadoOfrecimiento.PENDIENTE,
    });

    return this.ofrecimientoRepo.save(nuevo);
  }

  async obtenerRecibidos(usuarioId: number) {
    return this.ofrecimientoRepo.find({
      where: { oferta: { usuario: { id: usuarioId } } },
      relations: ['oferta', 'usuario', 'oferta.categoria'],
      order: { fecha: 'DESC' },
    });
  }

  async obtenerEnviados(usuarioId: number) {
    return this.ofrecimientoRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['oferta', 'oferta.categoria'],
      order: { fecha: 'DESC' },
    });
  }

  async aceptar(id: number, usuarioId: number) {
    const ofrecimiento = await this.ofrecimientoRepo.findOne({
      where: { id },
      relations: ['oferta', 'usuario', 'oferta.usuario'],
    });
  
    if (!ofrecimiento) {
      throw new NotFoundException('Ofrecimiento no encontrado');
    }
  
    if (ofrecimiento.oferta.usuario.id !== usuarioId) {
      throw new ForbiddenException('No autorizado');
    }
  
    // Cambiar estado del ofrecimiento aceptado
    ofrecimiento.estado = EstadoOfrecimiento.ACEPTADO;
    await this.ofrecimientoRepo.save(ofrecimiento);
  
    // Cambiar estado de la oferta a FINALIZADA
    ofrecimiento.oferta.estado = EstadoOferta.FINALIZADA;
    await this.ofertaRepo.save(ofrecimiento.oferta);
  
    // rechazamos los demas ofrecimientos
    await this.ofrecimientoRepo.update(
      {
        oferta: { id: ofrecimiento.oferta.id },
        id: Not(ofrecimiento.id),
      },
      { estado: EstadoOfrecimiento.RECHAZADO }
    );
  
    
    return {
      mensaje: 'Ofrecimiento aceptado. Estos son los datos de contacto del usuario:',
      contacto: {
        nombre: ofrecimiento.usuario.nombre,
        correo: ofrecimiento.usuario.correo,
        
      },
    };
  }

  async rechazar(id: number, usuarioId: number) {
    const ofrecimiento = await this.ofrecimientoRepo.findOne({
      where: { id },
      relations: ['oferta', 'usuario', 'oferta.usuario'],
    });
  
    if (!ofrecimiento) {
      throw new NotFoundException('Ofrecimiento no encontrado');
    }
  
    if (ofrecimiento.oferta.usuario.id !== usuarioId) {
      throw new ForbiddenException('No autorizado');
    }
  
    ofrecimiento.estado = EstadoOfrecimiento.RECHAZADO;
    return this.ofrecimientoRepo.save(ofrecimiento);
  }
  



}