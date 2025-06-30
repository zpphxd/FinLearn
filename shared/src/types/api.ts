// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth API types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
}

// Onboarding API types
export interface OnboardingAssessment {
  personalityQuestions: AssessmentQuestion[];
  knowledgeQuestions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'scale' | 'boolean';
  options?: string[];
  category: 'personality' | 'knowledge';
  weight: number;
}

export interface OnboardingResponse {
  personalityAnswers: Record<string, any>;
  knowledgeAnswers: Record<string, any>;
}

export interface OnboardingResult {
  personalityType: string;
  knowledgeLevel: string;
  suggestedPath: string;
  strengths: string[];
  areasToImprove: string[];
}

// Progress API types
export interface ProgressUpdate {
  lessonId: string;
  score: number;
  timeSpent: number;
  answers: {
    questionId: string;
    answer: string | string[];
    isCorrect: boolean;
    timeSpent: number;
    hintsUsed: number;
  }[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  rank: number;
}

export interface DashboardStats {
  totalXp: number;
  currentLevel: number;
  streak: number;
  lessonsCompleted: number;
  timeSpentToday: number;
  weeklyProgress: number[];
  nextAchievement?: {
    title: string;
    description: string;
    progress: number;
    target: number;
  };
}

// Admin API types
export interface CreateLessonRequest {
  levelId: string;
  title: string;
  description: string;
  type: string;
  estimatedTimeMinutes: number;
  xpReward: number;
  coinReward: number;
  content: any;
  difficulty: string;
  tags: string[];
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {
  id: string;
}

export interface AnalyticsData {
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionTime: number;
    retentionRate: number;
  };
  contentPerformance: {
    lessonId: string;
    title: string;
    completionRate: number;
    averageScore: number;
    averageTimeSpent: number;
    strugglingUsers: number;
  }[];
  systemMetrics: {
    totalUsers: number;
    totalLessons: number;
    totalWorlds: number;
    averageUserLevel: number;
  };
}

// Simulation API types
export interface SimulationState {
  simulationId: string;
  userId: string;
  currentState: Record<string, any>;
  history: SimulationAction[];
  isCompleted: boolean;
  score: number;
}

export interface SimulationAction {
  actionType: string;
  parameters: Record<string, any>;
  timestamp: Date;
  result: Record<string, any>;
}

// Gamification API types
export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: BadgeCriteria;
  rewards: {
    xp: number;
    coins: number;
  };
}

export interface BadgeCriteria {
  type: string;
  conditions: Record<string, any>;
}

export interface ChallengeDefinition {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: 'individual' | 'community';
  criteria: ChallengeCriteria;
  rewards: ChallengeReward[];
  participants: number;
}

export interface ChallengeCriteria {
  metric: string;
  target: number;
  timeframe: string;
}

export interface ChallengeReward {
  rank: number;
  xp: number;
  coins: number;
  badge?: string;
  title?: string;
} 