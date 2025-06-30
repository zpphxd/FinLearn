import express from 'express';
import Progress from '../models/Progress';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import { ProgressUpdate } from '@finlearn/shared';

const router = express.Router();

// Submit lesson progress
router.post('/lesson/:lessonId', asyncHandler(async (req: any, res: express.Response) => {
  const { lessonId } = req.params;
  const progressData: ProgressUpdate = req.body;
  
  // Find or create progress record
  let progress = await Progress.findOne({
    userId: req.user._id,
    lessonId
  });
  
  if (!progress) {
    progress = new Progress({
      userId: req.user._id,
      lessonId,
      answers: progressData.answers,
      timeSpent: progressData.timeSpent,
      attempts: 1
    });
  } else {
    progress.answers = progressData.answers;
    progress.timeSpent += progressData.timeSpent;
    progress.attempts += 1;
  }
  
  // Mark as completed if score is high enough
  if (progressData.score >= 70) {
    progress.completedAt = new Date();
    
    // Update user progress
    if (!req.user.progress.completedLessons.includes(lessonId)) {
      req.user.progress.completedLessons.push(lessonId);
      req.user.progress.totalTimeSpent += progressData.timeSpent;
      
      // Award XP and coins
      req.user.xp += 50; // Base XP for completion
      req.user.coins += 10; // Base coins for completion
      
      // Bonus for perfect score
      if (progressData.score === 100) {
        req.user.xp += 25;
        req.user.coins += 5;
      }
      
      req.user.calculateLevel();
      await req.user.save();
    }
  }
  
  await progress.save();
  
  res.json({
    success: true,
    data: progress,
    message: 'Progress updated successfully'
  });
}));

// Get user's progress for a lesson
router.get('/lesson/:lessonId', asyncHandler(async (req: any, res: express.Response) => {
  const { lessonId } = req.params;
  
  const progress = await Progress.findOne({
    userId: req.user._id,
    lessonId
  });
  
  res.json({
    success: true,
    data: progress
  });
}));

// Get user's overall progress
router.get('/overview', asyncHandler(async (req: any, res: express.Response) => {
  const userProgress = await Progress.find({
    userId: req.user._id
  });
  
  const stats = {
    totalLessons: userProgress.length,
    completedLessons: userProgress.filter(p => p.completedAt).length,
    averageScore: userProgress.length > 0 
      ? userProgress.reduce((sum, p) => sum + p.score, 0) / userProgress.length 
      : 0,
    totalTimeSpent: userProgress.reduce((sum, p) => sum + p.timeSpent, 0)
  };
  
  res.json({
    success: true,
    data: {
      progress: userProgress,
      stats
    }
  });
}));

export default router; 