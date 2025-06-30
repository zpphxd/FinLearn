import mongoose, { Schema, Document } from 'mongoose';
import { World as IWorld, Level as ILevel, LessonType, QuestionType, ResourceType, SimulationType, KnowledgeLevel } from '@finlearn/shared';

interface IWorldDocument extends Omit<IWorld, 'id'>, Document {}

const questionMetadataSchema = new Schema({
  difficulty: { type: Number, min: 1, max: 5, required: true },
  topic: { type: String, required: true },
  subtopic: { type: String },
  realWorldContext: { type: String }
});

const questionSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: Object.values(QuestionType), required: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Schema.Types.Mixed, required: true },
  explanation: { type: String, required: true },
  hints: [{ type: String }],
  points: { type: Number, required: true, min: 1 },
  timeLimit: { type: Number },
  metadata: questionMetadataSchema
});

const resourceSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: Object.values(ResourceType), required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String },
  content: { type: String },
  thumbnail: { type: String }
});

const choiceSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  impact: { type: Map, of: Number, required: true },
  unlocks: [{ type: String }]
});

const consequenceSchema = new Schema({
  choiceId: { type: String, required: true },
  immediate: { type: String, required: true },
  longTerm: { type: String },
  xpChange: { type: Number, required: true },
  coinChange: { type: Number, required: true }
});

const scenarioSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  choices: [choiceSchema],
  consequences: [consequenceSchema]
});

const successCriteriaSchema = new Schema({
  metric: { type: String, required: true },
  operator: { type: String, enum: ['gt', 'lt', 'eq', 'gte', 'lte'], required: true },
  value: { type: Number, required: true },
  description: { type: String, required: true }
});

const simulationSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: Object.values(SimulationType), required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  initialState: { type: Map, of: Schema.Types.Mixed, required: true },
  scenarios: [scenarioSchema],
  successCriteria: [successCriteriaSchema]
});

const lessonContentSchema = new Schema({
  introduction: { type: String },
  questions: [questionSchema],
  summary: { type: String },
  resources: [resourceSchema],
  simulation: simulationSchema
});

const lessonSchema = new Schema({
  id: { type: String, required: true },
  levelId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: Object.values(LessonType), required: true },
  order: { type: Number, required: true },
  estimatedTimeMinutes: { type: Number, required: true, min: 1 },
  xpReward: { type: Number, required: true, min: 1 },
  coinReward: { type: Number, required: true, min: 0 },
  content: lessonContentSchema,
  prerequisites: [{ type: String }],
  tags: [{ type: String }],
  difficulty: { type: String, enum: Object.values(KnowledgeLevel), required: true }
});

const levelSchema = new Schema({
  id: { type: String, required: true },
  worldId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  isLocked: { type: Boolean, default: true },
  lessons: [lessonSchema],
  xpReward: { type: Number, required: true },
  coinReward: { type: Number, required: true },
  difficultyRating: { type: Number, min: 1, max: 5, required: true }
});

const worldSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  order: { type: Number, required: true },
  isLocked: { type: Boolean, default: false },
  levels: [levelSchema],
  prerequisiteWorlds: [{ type: String }],
  totalXp: { type: Number, required: true },
  estimatedTimeMinutes: { type: Number, required: true }
}, {
  timestamps: true
});

// Ensure first world (budgeting) is never locked
worldSchema.pre('save', function(next) {
  if (this.order === 1) {
    this.isLocked = false;
  }
  next();
});

export default mongoose.model<IWorldDocument>('World', worldSchema); 