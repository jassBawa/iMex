import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try{
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(403).json({error: "Token is missing"});
    return;
  }  
  const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {userId: string}
    req.userId = decoded.userId;
    next();
  }catch(err){
    res.status(500).json({error: "Internal server error"})
  }
}
