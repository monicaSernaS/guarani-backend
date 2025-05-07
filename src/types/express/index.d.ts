import { Request } from 'express';
import { File } from 'multer';

export type UserRole = 'admin' | 'host' | 'user';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export interface UploadRequest extends Request {
  file?: File & { path: string };
}