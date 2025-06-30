import mongoose, { Schema, Document } from 'mongoose';
import { LessonProgress as ILessonProgress, LessonStatus, UserAnswer } from '@finlearn/shared';

interface IProgressDocument extends Omit<ILessonProgress, 'id'>, Document {
  calculateScore(): number;
  updateStatus(): void;
}

const userAnswerSchema = new Schema({
  questionId: { type: String, required: true },
  answer: { type: Schema.Types.Mixed, required: true },
  isCorrect: { type: Boolean, required: true },
  timeSpent: { type: Number, required: true },
  hintsUsed: { type: Number, default: 0 },
  attempts: { type: Number, default: 1 }
});

const progressSchema = new Schema({
  lessonId: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: String, enum: Object.values(LessonStatus), default: LessonStatus.NOT_STARTED },
  score: { type: Number, min: 0, max: 100, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  attempts: { type: Number, default: 0 },
  completedAt: { type: Date },
  answers: [userAnswerSchema]
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
progressSchema.index({ userId: 1, status: 1 });
progressSchema.index({ lessonId: 1, completedAt: 1 });

// Calculate score based on answers
progressSchema.methods.calculateScore = function() {
  if (this.answers.length === 0) return 0;
  
  const totalQuestions = this.answers.length;
  const correctAnswers = this.answers.filter((answer: UserAnswer) => answer.isCorrect).length;
  
  return Math.round((correctAnswers / totalQuestions) * 100);
};

// Update status based on score and completion
progressSchema.methods.updateStatus = function() {
  if (this.completedAt) {
    this.status = this.score === 100 ? LessonStatus.PERFECT : LessonStatus.COMPLETED;
  } else if (this.answers.length > 0) {
    this.status = LessonStatus.IN_PROGRESS;
  } else {
    this.status = LessonStatus.NOT_STARTED;
  }
};

// Pre-save middleware to auto-calculate score and status
progressSchema.pre('save', function(next) {
  this.score = this.calculateScore();
  this.updateStatus();
  next();
});

export default mongoose.model<IProgressDocument>('Progress', progressSchema); 