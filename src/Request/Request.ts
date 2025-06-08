import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    id: number; // o `id`, lo que tenga tu JWT
    // otros campos si querés: email, rol, etc.
  };
}