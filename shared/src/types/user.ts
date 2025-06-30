export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  personalityType?: PersonalityType;
  knowledgeLevel: KnowledgeLevel;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  progress: UserProgress;
  achievements: Achievement[];
}

export interface UserPreferences {
  dailyGoalMinutes: number;
  reminderTime?: string;
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface UserProgress {
  completedLessons: string[];
  currentWorld: string;
  currentLevel: number;
  worldProgress: Record<string, WorldProgress>;
  totalTimeSpent: number; // in minutes
}

export interface WorldProgress {
  worldId: string;
  levelsCompleted: number;
  totalLevels: number;
  xpEarned: number;
  averageScore: number;
  lastAccessed: Date;
}

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  xpReward: number;
  coinReward: number;
}

export enum PersonalityType {
  SAVER = 'saver',
  SPENDER = 'spender',
  INVESTOR = 'investor',
  CAUTIOUS = 'cautious',
  RISK_TAKER = 'risk-taker'
}

export enum KnowledgeLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum AchievementType {
  STREAK = 'streak',
  XP_MILESTONE = 'xp-milestone',
  WORLD_COMPLETION = 'world-completion',
  PERFECT_SCORE = 'perfect-score',
  SPEED_DEMON = 'speed-demon',
  CONSISTENCY = 'consistency'
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  isEmailVerified: boolean;
} 