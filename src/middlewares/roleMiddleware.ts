import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types/express';

const validRoles: UserRole[] = ['admin', 'host', 'user'];

export const requireRole = (...rolesAllowed: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: '🚫 Unauthorized: No user in request' });
      return;
    }

    const { role } = user;

    if (!validRoles.includes(role)) {
      res.status(403).json({ message: '❌ Invalid user role' });
      return;
    }

    if (!rolesAllowed.includes(role)) {
      res.status(403).json({ message: '❌ Forbidden: Insufficient permissions' });
      return;
    }

    return next();
  };
};
