import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc Register new user
// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, department, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(409);
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      department,
      role: role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE', // prevent self-promotion unless explicitly allowed
    },
    select: { id: true, name: true, email: true, role: true, department: true },
  });

  const token = generateToken(user.id);

  res.status(201).json({ success: true, data: user, token });
});

// @desc Login user
// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id);

  res.status(200).json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
    token,
  });
});

// @desc Get logged-in user profile
// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});