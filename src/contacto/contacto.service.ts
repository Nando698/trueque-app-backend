import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contacto } from './entities/contacto.entity';
import { Repository } from 'typeorm';
import { CreateContactoDto } from './DTO/create-contacto.dto';

@Injectable()
export class ContactoService {
  findAll() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Contacto)
    private contactoRepo: Repository<Contacto>,
  ) {}

  async guardarMensaje(dto: CreateContactoDto): Promise<Contacto> {
    const nuevo = this.contactoRepo.create(dto);
    return await this.contactoRepo.save(nuevo);
  }

  async obtenerTodos(): Promise<Contacto[]> {
    return this.contactoRepo.find({
      order: { fechaEnvio: 'DESC' },
    });
  }

  async eliminar(id: number): Promise<void> {
    await this.contactoRepo.delete(id);
  }
}
