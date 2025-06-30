import bcrypt from 'bcryptjs';

// User type for our simple backend
interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  completedLessons: string[];
  currentWorld: string;
  unlockedWorlds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Simple in-memory users store
export const users = new Map<string, User>();

// Add a demo user - starting from scratch
export const addDemoUser = async () => {
  const hashedPassword = await bcrypt.hash('demo123', 12);
  users.set('demo@finlearn.com', {
    id: '1',
    email: 'demo@finlearn.com',
    username: 'DemoUser',
    password: hashedPassword,
    xp: 0,
    level: 1,
    coins: 0,
    streak: 0,
    completedLessons: [],
    currentWorld: 'budgeting',
    unlockedWorlds: ['budgeting'],
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

// Initialize demo user
addDemoUser(); 