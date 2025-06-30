import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { users } from '../shared/users';

const router = express.Router();

// Generate JWT token
const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET || 'dev_super_secret_jwt_key_change_in_production_123456789';
  return jwt.sign({ userId }, secret, { expiresIn: '24h' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    if (users.has(email)) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      password: hashedPassword,
      xp: 0,
      level: 1,
      coins: 0,
      streak: 0,
      completedLessons: [],
      currentWorld: 'budgeting',
      unlockedWorlds: ['budgeting'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.set(email, newUser);
    
    const token = generateToken(newUser.id);
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          xp: newUser.xp,
          level: newUser.level,
          coins: newUser.coins,
          streak: newUser.streak,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        },
        token,
        refreshToken: token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          xp: user.xp,
          level: user.level,
          coins: user.coins,
          streak: user.streak,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token,
        refreshToken: token
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get current user
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'dev_super_secret_jwt_key_change_in_production_123456789';
    const decoded = jwt.verify(token, secret) as any;
    
    // Find user by id
    const user = Array.from(users.values()).find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        xp: user.xp,
        level: user.level,
        coins: user.coins,
        streak: user.streak,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// Refresh token (just return the same token for simplicity)
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  res.json({
    success: true,
    data: {
      token: refreshToken,
      refreshToken
    }
  });
});

// Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router; 