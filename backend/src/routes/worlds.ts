import express from 'express';
import World from '../models/World';
import { asyncHandler } from '../middleware/errorHandler';
import { optionalAuthMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all worlds
router.get('/', optionalAuthMiddleware, asyncHandler(async (req: any, res: express.Response) => {
  const worlds = await World.find().sort({ order: 1 });
  
  // If user is authenticated, check unlock status based on their progress
  if (req.user) {
    // Add logic to determine which worlds are unlocked for this user
    for (const world of worlds) {
      // Check if user has completed prerequisite worlds
      if (world.prerequisiteWorlds.length > 0) {
        const completedWorlds = req.user.progress.worldProgress || {};
        const hasCompletedPrereqs = world.prerequisiteWorlds.every(prereqId => 
          completedWorlds[prereqId] && completedWorlds[prereqId].levelsCompleted > 0
        );
        world.isLocked = !hasCompletedPrereqs;
      }
    }
  }

  res.json({
    success: true,
    data: worlds
  });
}));

// Get specific world by ID
router.get('/:worldId', optionalAuthMiddleware, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { worldId } = req.params;
  
  const world = await World.findOne({ id: worldId });
  
  if (!world) {
    return res.status(404).json({
      success: false,
      error: 'World not found'
    });
  }

  res.json({
    success: true,
    data: world
  });
}));

// Get levels for a specific world
router.get('/:worldId/levels', optionalAuthMiddleware, asyncHandler(async (req: any, res: express.Response) => {
  const { worldId } = req.params;
  
  const world = await World.findOne({ id: worldId });
  
  if (!world) {
    return res.status(404).json({
      success: false,
      error: 'World not found'
    });
  }

  let levels = world.levels;

  // If user is authenticated, determine which levels are unlocked
  if (req.user) {
    const userWorldProgress = req.user.progress.worldProgress?.get(worldId);
    
    if (userWorldProgress) {
      levels = levels.map((level, index) => ({
        ...level.toObject(),
        isLocked: index > userWorldProgress.levelsCompleted
      }));
    } else {
      // First time in this world, only first level is unlocked
      levels = levels.map((level, index) => ({
        ...level.toObject(),
        isLocked: index > 0
      }));
    }
  }

  res.json({
    success: true,
    data: levels
  });
}));

// Get specific level
router.get('/:worldId/levels/:levelId', optionalAuthMiddleware, asyncHandler(async (req: express.Request, res: express.Response) => {
  const { worldId, levelId } = req.params;
  
  const world = await World.findOne({ id: worldId });
  
  if (!world) {
    return res.status(404).json({
      success: false,
      error: 'World not found'
    });
  }

  const level = world.levels.find(l => l.id === levelId);
  
  if (!level) {
    return res.status(404).json({
      success: false,
      error: 'Level not found'
    });
  }

  res.json({
    success: true,
    data: level
  });
}));

export default router; 