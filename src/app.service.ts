import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'TP Programacion III ## Grupo 1';
  }
}
