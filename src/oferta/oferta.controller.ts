import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseInterceptors, UploadedFile, UploadedFiles, UseGuards, Req, Patch } from '@nestjs/common'
import { OfertaService } from './oferta.service'
import { CreateOfertaDto } from './DTOs/createOfertaDto'
import { UpdateOfertaDto } from './DTOs/updateOfertaDto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthRequest } from 'src/Request/Request'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { EstadoOferta } from './entities/oferta.entity'


@UseGuards(JwtAuthGuard)
@Controller('ofertas')
export class OfertaController {
  constructor(private readonly ofertaService: OfertaService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('imagenes', 3, {
    storage: diskStorage({
      destination: join(process.cwd(), 'src/upload'),
      filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + extname(file.originalname));
      },
    }),
  }))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateOfertaDto,
    @Req() req: AuthRequest ) {
    
    const imagenes = files.map(file => `http://localhost:3001/src/upload/${file.filename}`)

    const dtoConImagenes: CreateOfertaDto = {
      ...dto,
      imagenes,
      usuario_id: req.user.id
    };

    console.log("desde controller",req.user)
    return this.ofertaService.create(dtoConImagenes)
  }
  


  /////////////////////////////////////////////////////////////////////////////////////////////////
@Get('buscar')
buscar(
  @Query('categoria_id') categoriaId?: string,
  @Query('keywords') busqueda?: string,
) {
  return this.ofertaService.buscarPersonalizado({
    categoriaId: categoriaId ,
    texto: busqueda?.toLowerCase(),
  });
}

  @Get()
  findAll(
    @Query('categoria_id') categoriaId?: string,
    @Query('usuario_id') usuarioId?: string,
    @Query('estado') estado?: string,
  ) {
    if (usuarioId) {
      return this.ofertaService.buscarPorUsuario(+usuarioId, estado)
    }

    if (categoriaId) {
      return this.ofertaService.buscarPorCategoria(+categoriaId)
    }
    console.log('buscando ofertas');
    return this.ofertaService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ofertaService.findOne(+id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOfertaDto) {
    return this.ofertaService.update(+id, dto)
  }
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ofertaService.remove(+id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/pausar')
async pausar(@Param('id') id: string, @Req() req: AuthRequest) {
  return this.ofertaService.cambiarEstadoSiAutorizado(+id, EstadoOferta.PAUSADA, req.user.id, req.user.rol);
}

@UseGuards(JwtAuthGuard)
@Patch(':id/finalizar')
async finalizar(@Param('id') id: string, @Req() req: AuthRequest) {
  return this.ofertaService.cambiarEstadoSiAutorizado(+id, EstadoOferta.FINALIZADA, req.user.id, req.user.rol);
}

@UseGuards(JwtAuthGuard)
@Patch(':id/despausar')
async despausar(@Param('id') id: string, @Req() req: AuthRequest) {
return this.ofertaService.cambiarEstadoSiAutorizado(+id, EstadoOferta.ACTIVA, req.user.id, req.user.rol);
}



}
