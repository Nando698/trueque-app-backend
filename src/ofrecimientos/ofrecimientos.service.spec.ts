import { Test, TestingModule } from '@nestjs/testing';
import { OfrecimientosService } from './ofrecimientos.service';

describe('OfrecimientosService', () => {
  let service: OfrecimientosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfrecimientosService],
    }).compile();

    service = module.get<OfrecimientosService>(OfrecimientosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
