import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserById } from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim()) {
      throw new AppError('Name is required', 400);
    }

    if (!email?.trim()) {
      throw new AppError('Email is required', 400);
    }

    if (!password || password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    const result = await registerUser({ name, email, password });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email?.trim()) {
      throw new AppError('Email is required', 400);
    }

    if (!password) {
      throw new AppError('Password is required', 400);
    }

    const result = await loginUser({ email, password });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const user = await getUserById(String(req.user._id));
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
