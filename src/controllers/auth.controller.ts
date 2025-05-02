import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

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
      role: 'user'
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
