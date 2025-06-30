// Export all types
export * from './types/user';
export * from './types/lesson';
export * from './types/api';

// Utility functions
export const calculateLevel = (xp: number): number => {
  // XP required increases exponentially: 100, 250, 450, 700, 1000, 1350...
  let level = 1;
  let requiredXp = 100;
  let totalXp = 0;
  
  while (totalXp + requiredXp <= xp) {
    totalXp += requiredXp;
    level++;
    requiredXp = Math.floor(100 * Math.pow(1.5, level - 1));
  }
  
  return level;
};

export const calculateXpForNextLevel = (currentXp: number): number => {
  const currentLevel = calculateLevel(currentXp);
  return Math.floor(100 * Math.pow(1.5, currentLevel));
};

export const calculateXpProgress = (currentXp: number): { current: number; required: number; percentage: number } => {
  const currentLevel = calculateLevel(currentXp);
  let totalXpForCurrentLevel = 0;
  
  for (let i = 1; i < currentLevel; i++) {
    totalXpForCurrentLevel += Math.floor(100 * Math.pow(1.5, i - 1));
  }
  
  const xpInCurrentLevel = currentXp - totalXpForCurrentLevel;
  const xpRequiredForNextLevel = Math.floor(100 * Math.pow(1.5, currentLevel));
  
  return {
    current: xpInCurrentLevel,
    required: xpRequiredForNextLevel,
    percentage: Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100)
  };
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Constants
export const XP_REWARDS = {
  LESSON_COMPLETION: 50,
  PERFECT_SCORE: 25,
  DAILY_STREAK: 10,
  FIRST_ATTEMPT: 15,
  SPEED_BONUS: 5,
  HELP_OTHERS: 20
};

export const COIN_REWARDS = {
  LESSON_COMPLETION: 10,
  PERFECT_SCORE: 5,
  DAILY_STREAK: 2,
  ACHIEVEMENT_UNLOCK: 25,
  CHALLENGE_COMPLETION: 50
};

export const DIFFICULTY_MULTIPLIERS = {
  beginner: 1.0,
  intermediate: 1.2,
  advanced: 1.5,
  expert: 2.0
};

export const WORLD_THEMES = {
  budgeting: { color: '#10B981', icon: '💰' },
  credit: { color: '#3B82F6', icon: '💳' },
  investing: { color: '#8B5CF6', icon: '📈' },
  taxes: { color: '#F59E0B', icon: '📋' },
  insurance: { color: '#EF4444', icon: '🛡️' },
  retirement: { color: '#6366F1', icon: '🏖️' },
  realEstate: { color: '#14B8A6', icon: '🏠' },
  independence: { color: '#F97316', icon: '🎯' }
}; 