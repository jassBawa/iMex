import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(new ApiError(401, 'No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {userId: string}
    req.userId = decoded.userId;
    next();
  }catch(err){
    next(new ApiError(401, "Invalid or expired token" ))
  }
}
