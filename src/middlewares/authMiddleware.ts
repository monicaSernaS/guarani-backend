import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest, UserRole } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in environment variables');
}

interface TokenPayload extends JwtPayload {
  id: string;
  role: UserRole;
}

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: '🚫 Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (!decoded.id || !decoded.role) {
      res.status(401).json({ message: '❌ Invalid token structure' });
      return;
    }

    (req as AuthRequest).user = {
      id: decoded.id,
      role: decoded.role,
    };

    next(); 
  } catch (error) {
    res.status(401).json({ message: '❌ Invalid token' });
    return;
  }
};
