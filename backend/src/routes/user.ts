import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get user profile
router.get('/profile', asyncHandler(async (req: any, res: express.Response) => {
  res.json({
    success: true,
    data: req.user
  });
}));

// Update user profile
router.put('/profile', asyncHandler(async (req: any, res: express.Response) => {
  const { username, avatar } = req.body;
  
  if (username) req.user.username = username;
  if (avatar) req.user.avatar = avatar;
  
  await req.user.save();
  
  res.json({
    success: true,
    data: req.user,
    message: 'Profile updated successfully'
  });
}));

// Update user preferences
router.put('/preferences', asyncHandler(async (req: any, res: express.Response) => {
  const preferences = req.body;
  
  req.user.preferences = { ...req.user.preferences, ...preferences };
  await req.user.save();
  
  res.json({
    success: true,
    data: req.user.preferences,
    message: 'Preferences updated successfully'
  });
}));

// Get user stats
router.get('/stats', asyncHandler(async (req: any, res: express.Response) => {
  const stats = {
    totalXp: req.user.xp,
    currentLevel: req.user.level,
    streak: req.user.streak,
    coins: req.user.coins,
    lessonsCompleted: req.user.progress.completedLessons.length,
    totalTimeSpent: req.user.progress.totalTimeSpent,
    achievements: req.user.achievements.length
  };
  
  res.json({
    success: true,
    data: stats
  });
}));

export default router; 