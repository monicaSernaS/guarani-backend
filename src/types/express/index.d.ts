import { Request } from 'express';

export type UserRole = 'admin' | 'host' | 'user';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

