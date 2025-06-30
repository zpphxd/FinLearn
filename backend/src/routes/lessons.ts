import express from 'express';
import World from '../models/World';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get specific lesson
router.get('/:lessonId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { lessonId } = req.params;
  
  // Find the lesson across all worlds
  const world = await World.findOne({
    'levels.lessons.id': lessonId
  });
  
  if (!world) {
    return res.status(404).json({
      success: false,
      error: 'Lesson not found'
    });
  }
  
  let lesson = null;
  for (const level of world.levels) {
    lesson = level.lessons.find(l => l.id === lessonId);
    if (lesson) break;
  }
  
  res.json({
    success: true,
    data: lesson
  });
}));

// Get lessons for a specific level
router.get('/level/:levelId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { levelId } = req.params;
  
  const world = await World.findOne({
    'levels.id': levelId
  });
  
  if (!world) {
    return res.status(404).json({
      success: false,
      error: 'Level not found'
    });
  }
  
  const level = world.levels.find(l => l.id === levelId);
  
  res.json({
    success: true,
    data: level?.lessons || []
  });
}));

export default router; 