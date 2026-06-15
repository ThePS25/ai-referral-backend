import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError('JWT secret is not configured', 500);
  }

  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

const formatUser = (user: { _id: unknown; name: string; email: string }) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
});

export const registerUser = async (input: RegisterInput): Promise<AuthResponse> => {
  const { name, email, password } = input;

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  const token = generateToken(String(user._id));

  return {
    token,
    user: formatUser(user),
  };
};

export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const { email, password } = input;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(String(user._id));

  return {
    token,
    user: formatUser(user),
  };
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return formatUser(user);
};
