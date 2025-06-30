import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get user achievements
router.get('/achievements', asyncHandler(async (req: any, res: express.Response) => {
  res.json({
    success: true,
    data: req.user.achievements
  });
}));

// Get leaderboard
router.get('/leaderboard', asyncHandler(async (req: express.Request, res: express.Response) => {
  // Mock leaderboard data
  const leaderboard = [
    { userId: '1', username: 'FinanceGuru', xp: 2500, level: 8, streak: 25, rank: 1 },
    { userId: '2', username: 'MoneyMaven', xp: 2200, level: 7, streak: 18, rank: 2 },
    { userId: '3', username: 'BudgetBoss', xp: 1980, level: 7, streak: 12, rank: 3 }
  ];
  
  res.json({
    success: true,
    data: leaderboard
  });
}));

// Get active challenges
router.get('/challenges', asyncHandler(async (req: express.Request, res: express.Response) => {
  const challenges = [
    {
      id: 'weekly-streak',
      title: '7-Day Learning Streak',
      description: 'Complete at least one lesson every day for 7 days',
      type: 'individual',
      criteria: { metric: 'streak', target: 7, timeframe: 'week' },
      rewards: [{ rank: 1, xp: 100, coins: 50 }],
      participants: 245
    }
  ];
  
  res.json({
    success: true,
    data: challenges
  });
}));

export default router; 