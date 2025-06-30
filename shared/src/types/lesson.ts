export interface World {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isLocked: boolean;
  levels: Level[];
  prerequisiteWorlds: string[];
  totalXp: number;
  estimatedTimeMinutes: number;
}

export interface Level {
  id: string;
  worldId: string;
  title: string;
  description: string;
  order: number;
  isLocked: boolean;
  lessons: Lesson[];
  xpReward: number;
  coinReward: number;
  difficultyRating: number; // 1-5
}

export interface Lesson {
  id: string;
  levelId: string;
  title: string;
  description: string;
  type: LessonType;
  order: number;
  estimatedTimeMinutes: number;
  xpReward: number;
  coinReward: number;
  content: LessonContent;
  prerequisites: string[];
  tags: string[];
  difficulty: KnowledgeLevel;
}

export interface LessonContent {
  introduction?: string;
  questions: Question[];
  summary?: string;
  resources?: Resource[];
  simulation?: Simulation;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hints?: string[];
  points: number;
  timeLimit?: number; // in seconds
  metadata?: QuestionMetadata;
}

export interface QuestionMetadata {
  difficulty: number; // 1-5
  topic: string;
  subtopic?: string;
  realWorldContext?: string;
}

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  url?: string;
  content?: string;
  thumbnail?: string;
}

export interface Simulation {
  id: string;
  type: SimulationType;
  title: string;
  description: string;
  initialState: Record<string, any>;
  scenarios: Scenario[];
  successCriteria: SuccessCriteria[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
  consequences: Consequence[];
}

export interface Choice {
  id: string;
  text: string;
  impact: Record<string, number>;
  unlocks?: string[];
}

export interface Consequence {
  choiceId: string;
  immediate: string;
  longTerm?: string;
  xpChange: number;
  coinChange: number;
}

export interface SuccessCriteria {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
  description: string;
}

export enum LessonType {
  TUTORIAL = 'tutorial',
  QUIZ = 'quiz',
  SIMULATION = 'simulation',
  SCENARIO = 'scenario',
  MINI_GAME = 'mini-game',
  ASSESSMENT = 'assessment'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple-choice',
  FILL_IN_BLANK = 'fill-in-blank',
  TRUE_FALSE = 'true-false',
  MATCHING = 'matching',
  DRAG_DROP = 'drag-drop',
  SLIDER = 'slider',
  SCENARIO_CHOICE = 'scenario-choice',
  CALCULATION = 'calculation'
}

export enum ResourceType {
  ARTICLE = 'article',
  VIDEO = 'video',
  CALCULATOR = 'calculator',
  TEMPLATE = 'template',
  EXTERNAL_LINK = 'external-link'
}

export enum SimulationType {
  BUDGET_PLANNER = 'budget-planner',
  INVESTMENT_PORTFOLIO = 'investment-portfolio',
  DEBT_PAYOFF = 'debt-payoff',
  TAX_FILING = 'tax-filing',
  EMERGENCY_FUND = 'emergency-fund',
  RETIREMENT_PLANNING = 'retirement-planning'
}

// Response types
export interface LessonProgress {
  lessonId: string;
  userId: string;
  status: LessonStatus;
  score: number;
  timeSpent: number;
  attempts: number;
  completedAt?: Date;
  answers: UserAnswer[];
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
  attempts: number;
}

export enum LessonStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  PERFECT = 'perfect'
}

import { KnowledgeLevel } from './user'; 