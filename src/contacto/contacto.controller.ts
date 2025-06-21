import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './DTO/create-contacto.dto';
import { Contacto } from './entities/contacto.entity';

@Controller('contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  @Post()
  async recibirMensaje(@Body() dto: CreateContactoDto) {
    const contactoGuardado: Contacto =
      await this.contactoService.guardarMensaje(dto);

    return {
      message: 'Mensaje guardado correctamente',
      id: contactoGuardado.id,
    };
  }

  @Get()
  findAll(): Promise<Contacto[]> {
    return this.contactoService.obtenerTodos();
  }

  @Delete(':id')
  async eliminarMensaje(@Param('id') id: number) {
    await this.contactoService.eliminar(+id);
    return { message: 'Mensaje eliminado correctamente' };
  }
}
