import { Test, TestingModule } from '@nestjs/testing';
import { OfrecimientosController } from './ofrecimientos.controller';
import { OfrecimientosService } from './ofrecimientos.service';

describe('OfrecimientosController', () => {
  let controller: OfrecimientosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfrecimientosController],
      providers: [OfrecimientosService],
    }).compile();

    controller = module.get<OfrecimientosController>(OfrecimientosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
