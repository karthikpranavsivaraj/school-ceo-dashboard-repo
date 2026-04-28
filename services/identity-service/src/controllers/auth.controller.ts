import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MockUserDB } from '../models/user.model';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const RegisterSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['CEO', 'TEACHER', 'STUDENT', 'PARENT', 'TECH_OWNER'])
});

const LoginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validatedData = RegisterSchema.parse(req.body);
      const existingUser = await MockUserDB.findByUsername(validatedData.username);

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const passwordHash = await bcrypt.hash(validatedData.password, 10);
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        username: validatedData.username,
        email: validatedData.email,
        role: validatedData.role as any,
        passwordHash
      };

      await MockUserDB.create(newUser);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = LoginSchema.parse(req.body);
      const user = await MockUserDB.findByUsername(username);

      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token, role: user.role });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async validate(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      res.json({ valid: true, user: decoded });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}
