import type { NextFunction, Request, Response } from 'express';
import { loginSchema, signupSchema } from '../validations/auth-validations';
import { userMap } from '../memoryDb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import type { User } from '../types/types';

export async function signupHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.flatten().fieldErrors });
    }
    const { email, password, name } = parsed.data;

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      createdAt: new Date(),
      email: email,
      password: passwordHash,
      name: name,
      id: randomUUID(),
    };

    userMap.set(newUser.email, newUser);

    res.status(201).json({
      email: newUser.email,
      name: newUser.name,
      id: newUser.id,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.flatten().fieldErrors });
    }
    const { email, password } = parsed.data;
    const user = userMap.get(email);

    if (!user) {
      throw res.status(404).json({ error: 'User not found' });
    }

    const isUserValid = await bcrypt.compare(password, user.password);

    if (!isUserValid) {
      throw res.status(404).json({ error: 'Credentials wrong' });
    }
    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '4h' });

    res.status(200).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    next(err);
  }
}

