import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Get analytics data
router.get('/analytics', asyncHandler(async (req: express.Request, res: express.Response) => {
  // Placeholder analytics data
  const analytics = {
    userEngagement: {
      dailyActiveUsers: 150,
      weeklyActiveUsers: 800,
      monthlyActiveUsers: 2500,
      averageSessionTime: 22,
      retentionRate: 0.75
    },
    systemMetrics: {
      totalUsers: 5000,
      totalLessons: 120,
      totalWorlds: 8,
      averageUserLevel: 3.2
    }
  };
  
  res.json({
    success: true,
    data: analytics
  });
}));

export default router; 