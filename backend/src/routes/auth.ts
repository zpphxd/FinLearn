import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { LoginRequest, RegisterRequest, AuthResponse } from '@finlearn/shared';

const router = express.Router();

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || 'dev_super_secret_jwt_key_change_in_production_123456789';
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_super_secret_refresh_key_change_in_production_987654321';
  
  const accessToken = jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  const refreshToken = jwt.sign(
    { userId },
    jwtRefreshSecret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 20 }).trim(),
  body('password').isLength({ min: 6 })
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email, username, password }: RegisterRequest = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists with this email or username'
    });
  }

  // Create new user
  const user = new User({
    email,
    username,
    password,
    preferences: {
      dailyGoalMinutes: 15,
      theme: 'auto',
      soundEnabled: true,
      pushNotifications: true,
      emailNotifications: false
    },
    progress: {
      completedLessons: [],
      currentWorld: 'budgeting',
      currentLevel: 1,
      worldProgress: {},
      totalTimeSpent: 0
    }
  });

  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens((user._id as any).toString());

  // Save refresh token
  user.refreshTokens.push(refreshToken);
  await user.save();

  const response: AuthResponse = {
    user: {
      id: (user._id as any).toString(),
      email: user.email,
      username: user.username,
      avatar: user.avatar
    },
    token: accessToken,
    refreshToken
  };

  res.status(201).json({
    success: true,
    data: response,
    message: 'User registered successfully'
  });
}));

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email, password }: LoginRequest = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  // Update streak and last active date
  user.updateStreak();
  user.calculateLevel();
  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  // Save refresh token
  user.refreshTokens.push(refreshToken);
  await user.save();

  const response: AuthResponse = {
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      avatar: user.avatar
    },
    token: accessToken,
    refreshToken
  };

  res.json({
    success: true,
    data: response,
    message: 'Login successful'
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: 'Refresh token required'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());

    // Replace old refresh token with new one
    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.json({
      success: true,
      data: {
        token: accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
}));

// Logout
router.post('/logout', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Remove refresh token from user's token list
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const user = await User.findById(decoded.userId);

    if (user) {
      user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
      await user.save();
    }
  }

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// Get current user
router.get('/me', [
  // We'll add auth middleware here when we have it
], asyncHandler(async (req: any, res: express.Response) => {
  res.json({
    success: true,
    data: req.user
  });
}));

export default router; 