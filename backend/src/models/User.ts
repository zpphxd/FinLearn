import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as IUser, PersonalityType, KnowledgeLevel, AchievementType } from '@finlearn/shared';

interface IUserDocument extends Omit<IUser, 'id'>, Document {
  password: string;
  refreshTokens: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateTokens(): { accessToken: string; refreshToken: string };
  updateStreak(): void;
  calculateLevel(): number;
}

const achievementSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: Object.values(AchievementType), required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  unlockedAt: { type: Date, required: true },
  xpReward: { type: Number, required: true },
  coinReward: { type: Number, required: true }
});

const worldProgressSchema = new Schema({
  worldId: { type: String, required: true },
  levelsCompleted: { type: Number, default: 0 },
  totalLevels: { type: Number, required: true },
  xpEarned: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
});

const userProgressSchema = new Schema({
  completedLessons: [{ type: String }],
  currentWorld: { type: String, default: 'budgeting' },
  currentLevel: { type: Number, default: 1 },
  worldProgress: { type: Map, of: worldProgressSchema, default: {} },
  totalTimeSpent: { type: Number, default: 0 }
});

const userPreferencesSchema = new Schema({
  dailyGoalMinutes: { type: Number, default: 15 },
  reminderTime: { type: String },
  theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
  soundEnabled: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: false }
});

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String },
  personalityType: { type: String, enum: Object.values(PersonalityType) },
  knowledgeLevel: { type: String, enum: Object.values(KnowledgeLevel), default: KnowledgeLevel.BEGINNER },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  coins: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  preferences: { type: userPreferencesSchema, default: {} },
  progress: { type: userProgressSchema, default: {} },
  achievements: [achievementSchema],
  refreshTokens: [{ type: String }],
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.refreshTokens;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update streak based on last active date
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActive = new Date(this.lastActiveDate);
  const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    this.streak += 1;
  } else if (daysDiff > 1) {
    this.streak = 1;
  }
  // If daysDiff === 0, keep current streak
  
  this.lastActiveDate = today;
};

// Calculate level based on XP
userSchema.methods.calculateLevel = function() {
  let level = 1;
  let requiredXp = 100;
  let totalXp = 0;
  
  while (totalXp + requiredXp <= this.xp) {
    totalXp += requiredXp;
    level++;
    requiredXp = Math.floor(100 * Math.pow(1.5, level - 1));
  }
  
  this.level = level;
  return level;
};

export default mongoose.model<IUserDocument>('User', userSchema); 