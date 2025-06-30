import mongoose from 'mongoose';
import dotenv from 'dotenv';
import World from '../models/World';
import { LessonType, QuestionType, KnowledgeLevel } from '@finlearn/shared';

dotenv.config();

const sampleWorlds = [
  {
    id: 'budgeting',
    title: 'Budgeting Basics',
    description: 'Master the fundamentals of creating and managing a personal budget',
    icon: '💰',
    color: '#10B981',
    order: 1,
    isLocked: false,
    prerequisiteWorlds: [],
    totalXp: 300,
    estimatedTimeMinutes: 120,
    levels: [
      {
        id: 'budgeting-level-1',
        worldId: 'budgeting',
        title: 'What is a Budget?',
        description: 'Learn the basics of budgeting and why it matters',
        order: 1,
        isLocked: false,
        xpReward: 50,
        coinReward: 10,
        difficultyRating: 1,
        lessons: [
          {
            id: 'budget-intro-1',
            levelId: 'budgeting-level-1',
            title: 'Introduction to Budgeting',
            description: 'Understand what a budget is and why you need one',
            type: LessonType.TUTORIAL,
            order: 1,
            estimatedTimeMinutes: 5,
            xpReward: 25,
            coinReward: 5,
            difficulty: KnowledgeLevel.BEGINNER,
            prerequisites: [],
            tags: ['budgeting', 'basics', 'intro'],
            content: {
              introduction: 'A budget is a plan for how you\'ll spend your money. It helps you make sure you have enough money for the things you need and want.',
              questions: [
                {
                  id: 'q1',
                  type: QuestionType.MULTIPLE_CHOICE,
                  question: 'What is the main purpose of a budget?',
                  options: [
                    'To track how much money you make',
                    'To plan how you\'ll spend your money',
                    'To hide money from your family',
                    'To impress your friends'
                  ],
                  correctAnswer: 'To plan how you\'ll spend your money',
                  explanation: 'A budget is primarily a planning tool that helps you allocate your income to different expenses and savings goals.',
                  hints: ['Think about planning ahead', 'Consider what helps you manage money'],
                  points: 10,
                  metadata: {
                    difficulty: 1,
                    topic: 'budgeting',
                    subtopic: 'definition',
                    realWorldContext: 'Like planning a trip, you need to plan your finances'
                  }
                },
                {
                  id: 'q2',
                  type: QuestionType.TRUE_FALSE,
                  question: 'A budget should include both income and expenses.',
                  options: ['True', 'False'],
                  correctAnswer: 'True',
                  explanation: 'A complete budget shows your income (money coming in) and expenses (money going out) to help you see if you\'re spending more than you earn.',
                  points: 10,
                  metadata: {
                    difficulty: 1,
                    topic: 'budgeting',
                    subtopic: 'components'
                  }
                }
              ],
              summary: 'Great job! You\'ve learned that a budget is a plan for spending money and should include both income and expenses.',
              resources: [
                {
                  id: 'r1',
                  type: 'article',
                  title: 'Budgeting 101: Getting Started',
                  description: 'A comprehensive guide to creating your first budget',
                  url: '#'
                }
              ]
            }
          },
          {
            id: 'budget-50-30-20',
            levelId: 'budgeting-level-1',
            title: 'The 50/30/20 Rule',
            description: 'Learn a simple budgeting framework that works for most people',
            type: LessonType.TUTORIAL,
            order: 2,
            estimatedTimeMinutes: 8,
            xpReward: 30,
            coinReward: 6,
            difficulty: KnowledgeLevel.BEGINNER,
            prerequisites: ['budget-intro-1'],
            tags: ['budgeting', '50-30-20', 'framework'],
            content: {
              introduction: 'The 50/30/20 rule is a simple way to budget: 50% for needs, 30% for wants, and 20% for savings and debt payment.',
              questions: [
                {
                  id: 'q3',
                  type: QuestionType.MULTIPLE_CHOICE,
                  question: 'In the 50/30/20 rule, what percentage should go to needs?',
                  options: ['30%', '50%', '20%', '40%'],
                  correctAnswer: '50%',
                  explanation: 'The 50/30/20 rule allocates 50% of your after-tax income to needs like housing, food, and transportation.',
                  points: 15,
                  metadata: {
                    difficulty: 2,
                    topic: 'budgeting',
                    subtopic: '50-30-20-rule'
                  }
                },
                {
                  id: 'q4',
                  type: QuestionType.SCENARIO_CHOICE,
                  question: 'You earn $3,000 per month after taxes. Using the 50/30/20 rule, how much should you save?',
                  options: ['$300', '$600', '$900', '$1,500'],
                  correctAnswer: '$600',
                  explanation: '20% of $3,000 is $600. This amount should go toward savings and debt repayment.',
                  points: 20,
                  timeLimit: 60,
                  metadata: {
                    difficulty: 3,
                    topic: 'budgeting',
                    subtopic: 'calculations',
                    realWorldContext: 'Applying the rule to a real salary'
                  }
                }
              ],
              summary: 'The 50/30/20 rule is a great starting point for budgeting. Remember: 50% needs, 30% wants, 20% savings!'
            }
          }
        ]
      },
      {
        id: 'budgeting-level-2',
        worldId: 'budgeting',
        title: 'Creating Your First Budget',
        description: 'Build a personalized budget that works for your lifestyle',
        order: 2,
        isLocked: true,
        xpReward: 75,
        coinReward: 15,
        difficultyRating: 2,
        lessons: [
          {
            id: 'track-expenses',
            levelId: 'budgeting-level-2',
            title: 'Tracking Your Expenses',
            description: 'Learn how to monitor where your money goes',
            type: LessonType.SIMULATION,
            order: 1,
            estimatedTimeMinutes: 12,
            xpReward: 40,
            coinReward: 8,
            difficulty: KnowledgeLevel.BEGINNER,
            prerequisites: ['budget-50-30-20'],
            tags: ['tracking', 'expenses', 'monitoring'],
            content: {
              introduction: 'Before creating a budget, you need to know where your money currently goes. Let\'s track some expenses!',
              questions: [
                {
                  id: 'q5',
                  type: QuestionType.DRAG_DROP,
                  question: 'Categorize these expenses as "Needs" or "Wants":',
                  options: ['Rent', 'Netflix subscription', 'Groceries', 'Coffee shop visits', 'Car insurance'],
                  correctAnswer: ['Needs: Rent, Groceries, Car insurance', 'Wants: Netflix subscription, Coffee shop visits'],
                  explanation: 'Needs are essential for survival and basic functioning, while wants are things that improve your lifestyle but aren\'t necessary.',
                  points: 25,
                  metadata: {
                    difficulty: 2,
                    topic: 'budgeting',
                    subtopic: 'categorization'
                  }
                }
              ],
              simulation: {
                id: 'expense-tracker',
                type: 'budget-planner',
                title: 'Monthly Expense Tracker',
                description: 'Track your expenses for a typical month',
                initialState: {
                  balance: 3000,
                  expenses: [],
                  categories: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Savings']
                },
                scenarios: [
                  {
                    id: 'rent-payment',
                    title: 'Monthly Rent',
                    description: 'Your rent is due. How much do you spend on housing?',
                    choices: [
                      {
                        id: 'rent-1200',
                        text: '$1,200 (40% of income)',
                        impact: { housing: 1200, balance: -1200 }
                      },
                      {
                        id: 'rent-1500',
                        text: '$1,500 (50% of income)',
                        impact: { housing: 1500, balance: -1500 }
                      },
                      {
                        id: 'rent-900',
                        text: '$900 (30% of income)',
                        impact: { housing: 900, balance: -900 }
                      }
                    ],
                    consequences: [
                      {
                        choiceId: 'rent-900',
                        immediate: 'Great choice! You\'re spending 30% on housing, leaving more for other goals.',
                        longTerm: 'This gives you flexibility for savings and unexpected expenses.',
                        xpChange: 15,
                        coinChange: 3
                      }
                    ]
                  }
                ],
                successCriteria: [
                  {
                    metric: 'housing_percentage',
                    operator: 'lte',
                    value: 40,
                    description: 'Keep housing costs under 40% of income'
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: 'credit',
    title: 'Credit & Debt',
    description: 'Understand credit scores, credit cards, and debt management',
    icon: '💳',
    color: '#3B82F6',
    order: 2,
    isLocked: true,
    prerequisiteWorlds: ['budgeting'],
    totalXp: 400,
    estimatedTimeMinutes: 150,
    levels: [
      {
        id: 'credit-level-1',
        worldId: 'credit',
        title: 'Understanding Credit',
        description: 'Learn what credit is and how it works',
        order: 1,
        isLocked: false,
        xpReward: 60,
        coinReward: 12,
        difficultyRating: 2,
        lessons: [
          {
            id: 'what-is-credit',
            levelId: 'credit-level-1',
            title: 'What is Credit?',
            description: 'Understanding the basics of credit and credit scores',
            type: LessonType.TUTORIAL,
            order: 1,
            estimatedTimeMinutes: 10,
            xpReward: 35,
            coinReward: 7,
            difficulty: KnowledgeLevel.INTERMEDIATE,
            prerequisites: [],
            tags: ['credit', 'credit-score', 'basics'],
            content: {
              introduction: 'Credit is your ability to borrow money with the promise to pay it back later. Your credit score shows lenders how trustworthy you are.',
              questions: [
                {
                  id: 'q6',
                  type: QuestionType.MULTIPLE_CHOICE,
                  question: 'What is a credit score?',
                  options: [
                    'The amount of money you have in the bank',
                    'A number that represents how likely you are to pay back borrowed money',
                    'Your monthly income',
                    'The number of credit cards you own'
                  ],
                  correctAnswer: 'A number that represents how likely you are to pay back borrowed money',
                  explanation: 'A credit score is a three-digit number (usually 300-850) that represents your creditworthiness to lenders.',
                  points: 15,
                  metadata: {
                    difficulty: 2,
                    topic: 'credit',
                    subtopic: 'credit-score-definition'
                  }
                },
                {
                  id: 'q7',
                  type: QuestionType.MULTIPLE_CHOICE,
                  question: 'Which credit score range is considered "good"?',
                  options: ['300-579', '580-669', '670-739', '740-799'],
                  correctAnswer: '670-739',
                  explanation: 'A credit score of 670-739 is generally considered "good" by most lenders, while 740+ is considered "very good" or "excellent".',
                  points: 20,
                  metadata: {
                    difficulty: 3,
                    topic: 'credit',
                    subtopic: 'credit-score-ranges'
                  }
                }
              ],
              summary: 'Credit scores help lenders decide whether to lend you money and at what interest rate. Higher scores mean better terms!'
            }
          }
        ]
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finlearn';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await World.deleteMany({});
    console.log('🗑️  Cleared existing worlds');

    // Insert sample worlds
    await World.insertMany(sampleWorlds);
    console.log('🌍 Inserted sample worlds and lessons');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 