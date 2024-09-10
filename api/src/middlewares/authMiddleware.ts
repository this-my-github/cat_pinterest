import { Request, Response, NextFunction } from 'express';
import { verify } from '../utils/token';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = verify(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};