import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

dotenv.config();

export const register = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: '❗Email already registered' });
      return;
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      role: 'user' // por defecto
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id.toString(), savedUser.role);

    res.status(201).json({
      user: {
        id: savedUser._id,
        name: `${savedUser.firstName} ${savedUser.lastName}`,
        email: savedUser.email,
        role: savedUser.role
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '🚫 Internal server error' });
  }
};

export const login = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: '🚫 Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: '🚫 Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '🚫 Internal server error' });
  }
};

// Ruta protegida para crear el primer admin
export const createAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const providedSecret = req.headers['x-admin-secret'];
    const expectedSecret = process.env.ADMIN_CREATION_SECRET;

    if (!providedSecret || providedSecret !== expectedSecret) {
      res.status(403).json({ message: '❌ Unauthorized to create admin' });
      return;
    }

    const existing = await User.findOne({ email: 'monica.admin@example.com' });
    if (existing) {
      res.status(400).json({ message: '⚠️ Admin already exists' });
      return;
    }

    const admin = new User({
      firstName: 'Monica',
      lastName: 'Admin',
      email: 'monica.admin@example.com',
      password: 'monicaSecure123',
      role: 'admin',
      phone: '654321987',
      address: 'Oficina Central'
    });

    await admin.save();
    const token = generateToken(admin._id.toString(), admin.role);

    res.status(201).json({
      message: '✅ Admin created successfully',
      user: {
        email: admin.email,
        token
      }
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ message: '🚫 Internal server error' });
  }
};
