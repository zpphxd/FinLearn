import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import simplified auth routes
import authRoutes from './routes/simple-auth';
import jwt from 'jsonwebtoken';
import { users } from './shared/users';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);

// Comprehensive lesson data with Mountain Hiker Theme
const lessonData = {
  budgeting: [
    {
      id: 'budgeting_1',
      title: 'Base Camp Basics: Your Financial Foundation',
      description: 'Start your financial journey by learning the fundamentals of budgeting at Base Camp',
      difficulty: 1,
      xpReward: 50,
      coinReward: 10,
      estimatedTime: '4 min',
      content: {
        type: 'interactive',
        sections: [
          {
            type: 'story',
            title: 'Welcome to Financial Mountain',
            content: 'Every successful mountain climber starts at Base Camp with a plan. Your budget is like your climbing gear - it helps you navigate safely to the summit of financial freedom. Without it, you might find yourself lost in a blizzard of unexpected expenses!',
            visual: '🏕️⛰️📋',
            character: 'Meet Maya, your financial climbing guide. She\'s summited many financial peaks and will help you on your journey.'
          },
          {
            type: 'concept',
            title: 'What is a Budget?',
            content: 'A budget is your financial map and compass rolled into one. Just like a mountain route plan, it shows you exactly where your money needs to go to reach your destination safely.',
            visual: '💰🗺️➡️🎯',
            analogy: 'Think of it like planning your hiking supplies: you need to know exactly what you\'re carrying and why.'
          },
          {
            type: 'question',
            question: 'Why do mountain climbers (and budgeters) need a detailed plan?',
            options: [
              'To make the journey boring and restrictive',
              'To know exactly what resources they need and where they\'re going',
              'To impress other climbers',
              'To avoid having any fun along the way'
            ],
            correctAnswer: 1,
            explanation: 'Exactly! Just like climbers plan their route to reach the summit safely, budgets help you reach your financial goals without getting lost or running out of resources.',
            mascotReaction: 'Maya gives you a thumbs up! "Smart thinking, future summit-climber!"'
          },
          {
            type: 'interactive_demo',
            title: 'Budget Building Exercise',
            content: 'Let\'s pack your financial backpack! Drag these items into your budget categories:',
            items: [
              { name: 'Rent/Housing', category: 'needs', emoji: '🏠' },
              { name: 'Groceries', category: 'needs', emoji: '🥘' },
              { name: 'Movie tickets', category: 'wants', emoji: '🎬' },
              { name: 'Emergency fund', category: 'savings', emoji: '🛡️' }
            ]
          }
        ]
      }
    },
    {
      id: 'budgeting_2',
      title: 'Trail Mapping: Income vs Expenses',
      description: 'Navigate the flowing streams of income and the rocky paths of expenses',
      difficulty: 1,
      xpReward: 60,
      coinReward: 15,
      estimatedTime: '5 min',
      content: {
        type: 'interactive',
        sections: [
          {
            type: 'story',
            title: 'The Two Rivers',
            content: 'Every mountain has two types of water flow: streams flowing IN from melting snow (your income) and streams flowing OUT down the mountainside (your expenses). Maya teaches you that successful climbers always know which direction the water flows!',
            visual: '💧⬇️💰 | 💸⬆️🏔️'
          },
          {
            type: 'concept',
            title: 'Income Streams vs Expense Trails',
            content: 'Income flows into your financial reservoir like mountain springs (salary, side hustles, gifts). Expenses flow out like trails leading away from your camp (rent, food, entertainment, gear).',
            visual: '🏔️💧➡️💰 | 💰➡️🛤️💸',
            tips: 'Pro climber tip: Track every stream in and every trail out!'
          },
          {
            type: 'scenario',
            title: 'Alex\'s Mountain Budget Adventure',
            scenario: 'Alex works as a park ranger earning $2,400/month. Their monthly expenses include: Mountain cabin rent ($800), Trail food & groceries ($400), Climbing gear maintenance ($200), Entertainment in town ($300), and Transportation ($200).',
            question: 'How much surplus does Alex have for savings and emergency fund?',
            options: ['$200', '$500', '$700', '$300'],
            correctAnswer: 1,
            explanation: 'Perfect calculation! $2,400 - $800 - $400 - $200 - $300 - $200 = $500 left for building their financial safety net!',
            visual: '🏔️💰: $2,400 ➖ 🏠$800 ➖ 🍽️$400 ➖ 🧗$200 ➖ 🎯$300 ➖ 🚗$200 = 💎$500'
          },
          {
            type: 'practice',
            title: 'Your Income vs Expense Tracker',
            content: 'Calculate your own financial altitude:',
            interactive: true,
            questions: [
              { label: 'Monthly Income Streams', type: 'input', placeholder: 'Enter your total monthly income' },
              { label: 'Monthly Expense Trails', type: 'input', placeholder: 'Enter your total monthly expenses' },
              { label: 'Your Financial Surplus/Deficit', type: 'calculated', formula: 'income - expenses' }
            ]
          }
        ]
      }
    },
    {
      id: 'budgeting_3',
      title: 'The 50/30/20 Mountain Trail Rule',
      description: 'Master the legendary trail allocation method used by financial summit veterans',
      difficulty: 2,
      xpReward: 80,
      coinReward: 20,
      estimatedTime: '6 min',
      content: {
        type: 'interactive',
        sections: [
          {
            type: 'story',
            title: 'The Ancient Trail Formula',
            content: 'Deep in the mountains, Maya reveals an ancient secret used by the most successful financial climbers for generations. It\'s called the 50/30/20 Trail Rule - a time-tested path that leads straight to Financial Summit.',
            visual: '📜🏔️✨',
            legend: 'This formula has guided thousands of climbers to financial peaks!'
          },
          {
            type: 'concept',
            title: 'The Three Sacred Paths',
            content: '🏕️ Base Camp Needs (50%): Essential survival gear (housing, food, utilities)\n🎪 Adventure Experiences (30%): Fun activities that make the journey enjoyable\n💎 Summit Fund (20%): Savings and debt repayment for reaching your peak',
            visual: '🏠50% | 🎉30% | ⛰️20%',
            mantra: 'Maya\'s Mantra: "Needs keep you alive, wants keep you motivated, savings get you to the summit!"'
          },
          {
            type: 'interactive_demo',
            title: 'Trail Calculator - Your Personal Route',
            scenario: 'You\'ve earned $3,000 this month from your mountain guide job. Let\'s map your trail:',
            interactive: true,
            calculator: {
              income: 3000,
              needs: { percentage: 50, amount: 1500, examples: ['Cabin rent', 'Food & water', 'Basic gear'] },
              wants: { percentage: 30, amount: 900, examples: ['Entertainment', 'Dining out', 'Hobby gear'] },
              savings: { percentage: 20, amount: 600, examples: ['Emergency fund', 'Summit goals', 'Equipment upgrades'] }
            }
          },
          {
            type: 'scenario',
            title: 'Jordan\'s Trail Challenge',
            scenario: 'Jordan earns $2,500/month but struggles with the trail allocation. They currently spend $1,400 on needs, $1,000 on wants, and save only $100.',
            question: 'What should Jordan adjust to follow the 50/30/20 rule?',
            options: [
              'Increase needs spending',
              'Reduce wants from $1,000 to $750 and increase savings to $500',
              'Eliminate all wants spending',
              'Find a way to earn more money first'
            ],
            correctAnswer: 1,
            explanation: 'Great advice! Jordan should trim their want spending by $250 and boost their savings by $400. Small adjustments can lead to big summit success!',
            visual: '🎯 Target: $1,250 needs | $750 wants | $500 savings'
          },
          {
            type: 'achievement',
            title: 'Trail Master Badge Earned!',
            content: 'You\'ve learned the sacred 50/30/20 formula. Maya is impressed with your dedication to the mountain way!'
          }
        ]
      }
    },
    {
      id: 'budgeting_4',
      title: 'Fixed vs Variable: Steady Rocks vs Shifting Weather',
      description: 'Learn to distinguish between the steady mountain foundations and changing weather patterns',
      difficulty: 2,
      xpReward: 70,
      coinReward: 18,
      estimatedTime: '5 min',
      content: {
        type: 'interactive',
        sections: [
          {
            type: 'story',
            title: 'The Mountain\'s Two Faces',
            content: 'Maya points to the mountain peak: "See those solid granite cliffs? Those are like your fixed expenses - they never change. But notice how the weather shifts daily? That\'s your variable expenses - always moving, always different."',
            visual: '🏔️⚡🌦️',
            wisdom: 'Understanding both types helps you prepare for any climbing conditions!'
          },
          {
            type: 'concept',
            title: 'Solid Rock Expenses (Fixed)',
            content: 'These expenses are like the mountain itself - steady, predictable, unchanging each month. You can always count on them being the same amount.',
            examples: ['🏠 Base camp rent', '🚗 Equipment insurance', '📱 Communication device plan', '🎓 Climbing course payments'],
            visual: '🗿 = Same every month'
          },
          {
            type: 'concept',
            title: 'Weather Pattern Expenses (Variable)',
            content: 'Like mountain weather, these change based on your choices and circumstances. Sometimes higher, sometimes lower.',
            examples: ['🥘 Trail food & groceries', '⛽ Transportation fuel', '🎬 Entertainment adventures', '🧗 Extra gear purchases'],
            visual: '🌤️⛈️☀️ = Changes monthly'
          },
          {
            type: 'game',
            title: 'Expense Sorting Challenge',
            content: 'Help Maya sort these expenses into Fixed (Solid Rock) or Variable (Changing Weather):',
            items: [
              { expense: 'Monthly gym membership', answer: 'fixed', emoji: '💪' },
              { expense: 'Weekly grocery shopping', answer: 'variable', emoji: '🛒' },
              { expense: 'Car payment', answer: 'fixed', emoji: '🚗' },
              { expense: 'Coffee shop visits', answer: 'variable', emoji: '☕' },
              { expense: 'Streaming subscription', answer: 'fixed', emoji: '📺' },
              { expense: 'Weekend activities', answer: 'variable', emoji: '🎯' }
            ]
          },
          {
            type: 'strategy',
            title: 'Maya\'s Pro Climbing Tips',
            content: 'Smart climbers plan for both:\n🗿 Fixed expenses: Budget these first - they\'re non-negotiable\n🌦️ Variable expenses: Set aside a range and track them weekly\n💡 Pro tip: Turn some variable expenses into fixed ones (like automatic savings!)',
            actionable: true
          }
        ]
      }
    },
    {
      id: 'budgeting_5',
      title: 'Emergency Shelter: Building Your Financial Safety Net',
      description: 'Construct an unshakeable emergency shelter for life\'s unexpected storms',
      difficulty: 2,
      xpReward: 90,
      coinReward: 25,
      estimatedTime: '7 min',
      content: {
        type: 'interactive',
        sections: [
          {
            type: 'story',
            title: 'The Great Storm Story',
            content: 'Maya shares a story from her early climbing days: "I was halfway up Financial Peak when a massive storm hit. My climbing partner had built a solid emergency shelter with months of preparation. I had nothing. Guess who made it to the summit and who had to turn back?"',
            visual: '⛈️🏔️🏕️',
            lesson: 'Emergency funds aren\'t just smart - they\'re essential for reaching your financial summit!'
          },
          {
            type: 'concept',
            title: 'Your Financial Emergency Shelter',
            content: 'An emergency fund is like a weatherproof shelter that protects you from life\'s financial storms. It covers 3-6 months of expenses, but start with your first milestone: $1,000.',
            visual: '🛡️💰🌪️➡️😌',
            stages: 'Shelter Building Stages:\n🏕️ Basic: $500-1,000\n🏠 Intermediate: 1-3 months expenses\n🏰 Advanced: 3-6 months expenses'
          },
          {
            type: 'calculator',
            title: 'Emergency Shelter Size Calculator',
            content: 'Calculate your emergency fund target:',
            interactive: true,
            inputs: [
              { label: 'Monthly Essential Expenses', type: 'number', id: 'monthly' },
              { label: 'Desired Months of Coverage (3-6)', type: 'number', id: 'months', min: 3, max: 6 }
            ],
            result: 'Your Emergency Shelter Target: ${monthly * months}'
          },
          {
            type: 'scenario',
            title: 'Storm Survival Scenario',
            scenario: 'Your mountain bike breaks down and needs $1,200 in repairs to get to work. You have three options available:',
            options: [
              { 
                choice: 'Use $1,200 from your $2,000 emergency fund',
                result: 'Perfect! This is exactly what emergency funds are for. Rebuild it gradually.',
                outcome: 'best',
                explanation: 'Your shelter protected you! Now repair and rebuild for the next storm.'
              },
              {
                choice: 'Put it on a credit card to preserve your emergency fund',
                result: 'Risky! Credit card interest will cost you more than rebuilding your fund.',
                outcome: 'poor',
                explanation: 'You\'re choosing expensive debt over your safety net.'
              },
              {
                choice: 'Take a personal loan to avoid touching savings',
                result: 'Expensive mistake! Loans have fees and interest.',
                outcome: 'poor',
                explanation: 'You built the shelter to use it - don\'t pay extra for alternatives!'
              }
            ],
            mascotAdvice: 'Maya nods: "Real climbers use their emergency gear when emergencies happen!"'
          },
          {
            type: 'action_plan',
            title: 'Your Emergency Shelter Building Plan',
            content: 'Create your personalized shelter building strategy:',
            steps: [
              '🎯 Set your first milestone: $1,000',
              '💰 Calculate weekly savings needed: $1,000 ÷ how many weeks?',
              '🤖 Automate transfers to a separate "Emergency" account',
              '📱 Track progress weekly - celebrate milestones!',
              '🚫 Only use for true emergencies (not wants or planned expenses)'
            ],
            commitment: 'I commit to saving $____ per week for my emergency shelter!'
          }
        ]
      }
    },
    {
      id: 'budgeting_6',
      title: 'Trail Tracking: Following Your Financial Footsteps',
      description: 'Master the art of expense tracking to stay on the path to Financial Summit',
      difficulty: 3,
      xpReward: 85,
      coinReward: 22,
      estimatedTime: '6 min',
      content: {
        type: 'interactive',
        sections: [
          {
            type: 'story',
            title: 'The Mystery of the Missing Supplies',
            content: 'Maya tells you about climbers who started with full packs but arrived at camp with half their supplies missing. "They never tracked where their resources went along the trail. Don\'t let your money disappear like morning mist!"',
            visual: '🎒➡️❓➡️🎒💨',
            warning: 'Studies show people spend 20% more than they think!'
          },
          {
            type: 'concept',
            title: 'Expense Tracking = Trail Navigation',
            content: 'Just like leaving breadcrumbs on a trail, tracking expenses shows you exactly where your money traveled. This helps you find the best routes and avoid money-wasting detours.',
            visual: '🍞➡️💰➡️📍',
            methods: '📱 Digital: Apps like Mint, YNAB, or simple spreadsheets\n📝 Analog: Notebook or envelope method\n📸 Receipt Photos: Quick snap for later categorization'
          },
          {
            type: 'challenge',
            title: '7-Day Trail Tracking Challenge',
            content: 'For one week, track every expense like a mountain ranger tracking wildlife:',
            days: [
              { day: 'Monday', categories: ['🏠 Shelter', '🥘 Food', '🚗 Transport', '🎯 Fun', '💳 Other'] },
              { day: 'Tuesday', categories: ['🏠 Shelter', '🥘 Food', '🚗 Transport', '🎯 Fun', '💳 Other'] },
              { day: 'Wednesday', categories: ['🏠 Shelter', '🥘 Food', '🚗 Transport', '🎯 Fun', '💳 Other'] },
              { day: 'Thursday', categories: ['🏠 Shelter', '🥘 Food', '🚗 Transport', '🎯 Fun', '💳 Other'] },
              { day: 'Friday', categories: ['🏠 Shelter', '🥘 Food', '🚗 Transport', '🎯 Fun', '💳 Other'] },
              { day: 'Saturday', categories: ['🏠 Shelter', '🥘 Food', '🚗 Transport', '🎯 Fun', '💳 Other'] },
              { day: 'Sunday', categories: ['🏠 Shelter', '🥘 Food', '🚗 Transport', '🎯 Fun', '💳 Other'] }
            ],
            reward: 'Complete the challenge and Maya will teach you advanced trail reading techniques!'
          },
          {
            type: 'insight',
            title: 'Reading Your Financial Trail Map',
            content: 'After tracking, look for patterns:',
            patterns: [
              '🕐 Time patterns: Do you spend more on weekends?',
              '😊 Mood patterns: Stress spending or celebration splurges?',
              '📍 Location patterns: Coffee shop visits adding up?',
              '💳 Method patterns: Cash vs card spending differences?',
              '📦 Category surprises: Where did more money go than expected?'
            ]
          },
          {
            type: 'tools',
            title: 'Maya\'s Favorite Tracking Tools',
            content: 'Choose your tracking weapon:',
            options: [
              {
                tool: '📱 Smartphone Apps',
                pros: 'Automatic categorization, photos, reminders',
                cons: 'Requires phone, might be overwhelming',
                best_for: 'Tech-savvy climbers'
              },
              {
                tool: '📓 Simple Notebook',
                pros: 'Always works, no battery needed, personal',
                cons: 'Manual entry, easy to forget',
                best_for: 'Minimalist climbers'
              },
              {
                tool: '💻 Spreadsheet',
                pros: 'Customizable, calculations, charts',
                cons: 'Setup time, computer needed',
                best_for: 'Detail-oriented climbers'
              }
            ]
          }
        ]
      }
    }
  ],
  credit: [
    {
      id: 'credit_1',
      title: 'Credit Cliff Introduction: Understanding the Ledge',
      description: 'Learn the basics of credit - a powerful tool that can elevate or endanger your climb',
      difficulty: 1,
      xpReward: 60,
      coinReward: 15,
      estimatedTime: '5 min',
      content: {
        type: 'interactive',
        sections: [
          {
            type: 'story',
            title: 'The Double-Edged Climbing Rope',
            content: 'Maya points to a climbing rope: "Credit is like this rope. Used properly, it can help you reach heights impossible alone. Used carelessly, it can send you tumbling down Credit Cliff into Debt Valley - a place many climbers never escape."',
            visual: '🧗‍♀️⬆️💳 vs 💳⬇️📉',
            warning: 'Handle with respect and knowledge!'
          },
          {
            type: 'concept',
            title: 'What is Credit?',
            content: 'Credit is borrowed money that you promise to repay later, usually with interest. It\'s like borrowing climbing gear - you must return it, often with a rental fee.',
            visual: '🏛️💳➡️💰⏰💵',
            analogy: 'Think of it as a temporary bridge across a financial gap.'
          },
          {
            type: 'question',
            question: 'When you swipe a credit card for a $50 purchase, what really happens?',
            options: [
              'You spend your own money from your checking account',
              'The bank lends you $50 that you must pay back',
              'You get $50 for free from the credit card company',
              'Your savings account automatically transfers the money'
            ],
            correctAnswer: 1,
            explanation: 'Exactly! You\'re borrowing $50 from the bank. If you don\'t pay it back quickly, they\'ll charge you interest - sometimes a lot of interest!',
            mascotReaction: 'Maya nods approvingly: "Understanding this difference keeps you out of Debt Valley!"'
          },
          {
            type: 'real_world',
            title: 'Credit in Daily Life',
            scenarios: [
              {
                situation: '🏠 Renting an apartment',
                credit_role: 'Landlords check credit to see if you pay bills on time'
              },
              {
                situation: '🚗 Buying a car',
                credit_role: 'Good credit = lower interest rates = thousands saved'
              },
              {
                situation: '💼 Some job applications',
                credit_role: 'Financial responsibility can be part of hiring decisions'
              },
              {
                situation: '📱 Phone contracts',
                credit_role: 'No credit check needed with good credit history'
              }
            ]
          }
        ]
      }
    },
    {
      id: 'credit_2',
      title: 'Credit Score Compass: Your Financial Navigation Tool',
      description: 'Master the 300-850 scale that guides your financial climbing opportunities',
      difficulty: 1,
      xpReward: 70,
      coinReward: 18,
      estimatedTime: '6 min',
      content: {
        type: 'interactive',
        sections: [
          {
            type: 'story',
            title: 'The Financial Reputation System',
            content: 'Maya explains: "In the climbing community, reputation matters. If you\'re known for returning borrowed gear in good condition and helping fellow climbers, others trust you more. Your credit score is exactly like that - but for money."',
            visual: '👥💬➡️📊300-850',
            insight: 'Higher scores = more trust = better opportunities!'
          },
          {
            type: 'concept',
            title: 'The Credit Score Climbing Grades',
            content: 'Credit scores range from 300-850, like climbing difficulty grades:',
            grades: [
              { range: '300-579', grade: '⛔ Danger Zone', description: 'Steep cliffs ahead - major work needed' },
              { range: '580-669', grade: '🟡 Learning Slopes', description: 'Gaining skills - keep practicing' },
              { range: '670-739', grade: '🟢 Steady Ascent', description: 'Good progress - most paths open' },
              { range: '740-799', grade: '🔵 Advanced Climber', description: 'Excellent skills - premium routes available' },
              { range: '800-850', grade: '⭐ Summit Master', description: 'Elite status - best opportunities await' }
            ],
            visual: '📊⬆️🏔️'
          },
          {
            type: 'interactive_gauge',
            title: 'Credit Score Impact Calculator',
            content: 'See how different scores affect a $20,000 car loan:',
            calculator: {
              loan_amount: 20000,
              term_years: 5,
              scores: [
                { score: 620, rate: 12.9, monthly: 459, total_interest: 7540 },
                { score: 680, rate: 8.3, monthly: 410, total_interest: 4600 },
                { score: 740, rate: 4.8, monthly: 375, total_interest: 2500 },
                { score: 800, rate: 3.2, monthly: 360, total_interest: 1600 }
              ]
            },
            insight: 'Maya points out: "A 180-point difference saves you almost $6,000! That\'s serious climbing gear money!"'
          },
          {
            type: 'myth_busting',
            title: 'Credit Score Myths Debunked',
            myths: [
              {
                myth: '💳 "Carrying a balance improves your credit score"',
                truth: 'FALSE! Paying in full each month is better and saves money on interest',
                maya_says: 'Don\'t pay interest to build credit - that\'s like paying for mountain air!'
              },
              {
                myth: '💰 "You need to be rich to have good credit"',
                truth: 'FALSE! Credit is about payment reliability, not income amount',
                maya_says: 'I\'ve seen struggling students with 800+ scores - it\'s about habits, not wealth!'
              },
              {
                myth: '📊 "Checking your score hurts your credit"',
                truth: 'FALSE! Checking your own score is a "soft pull" that doesn\'t hurt',
                maya_says: 'Check your score monthly like checking your climbing gear!'
              }
            ]
          }
        ]
      }
    }
  ],
  investing: [
    {
      id: 'investing_1',
      title: 'Investment Peak Preparation: Why Climb Higher?',
      description: 'Discover why investing is the ultimate summit that makes your money grow while you sleep',
      difficulty: 1,
      xpReward: 75,
      coinReward: 20,
      estimatedTime: '6 min',
      content: {
        type: 'interactive',
        sections: [
          {
            type: 'story',
            title: 'The Tale of Two Climbers',
            content: 'Maya tells a legendary story: "Two climbers, Sam and Alex, each saved $1,000. Sam kept his money in Base Camp (savings account). Alex sent her money up Investment Peak to work for her. After 20 years, Sam had $1,200. Alex had $7,400. The mountain had done the climbing for her!"',
            visual: '🏕️$1,200 vs 🏔️$7,400',
            moral: 'Let compound growth be your climbing partner!'
          },
          {
            type: 'concept',
            title: 'Why Savings Accounts Aren\'t Enough',
            content: 'Inflation is like mountain erosion - it slowly wears away your money\'s buying power. A savings account earning 1% can\'t keep up with 3% inflation.',
            visual: '💰📉⏰',
            reality_check: 'What costs $100 today will cost $134 in 10 years with 3% inflation!'
          },
          {
            type: 'interactive_demo',
            title: 'The Compound Growth Climbing Expedition',
            content: 'Watch how $1,000 grows over time with different strategies:',
            scenarios: [
              {
                strategy: '🏕️ Base Camp Savings (1% return)',
                year_5: '$1,051',
                year_10: '$1,105',
                year_20: '$1,220',
                year_30: '$1,348'
              },
              {
                strategy: '🏔️ Investment Peak (7% return)',
                year_5: '$1,403',
                year_10: '$1,967',
                year_20: '$3,870',
                year_30: '$7,612'
              }
            ],
            insight: 'Maya gasps: "Look at year 30! The same $1,000 becomes either $1,348 or $7,612. That\'s the power of climbing Investment Peak!"'
          },
          {
            type: 'time_value',
            title: 'The Early Climber\'s Advantage',
            content: 'Starting early is like getting a head start on the trail:',
            comparison: [
              {
                climber: 'Early Emma',
                starts_age: 22,
                monthly: 200,
                stops_age: 32,
                total_invested: 24000,
                value_at_65: 472000
              },
              {
                climber: 'Later Larry',
                starts_age: 32,
                monthly: 200,
                stops_age: 65,
                total_invested: 79200,
                value_at_65: 394000
              }
            ],
            moral: 'Emma invested $55,200 less but ended up with $78,000 more!'
          }
        ]
      }
    }
  ],
  saving: [
    {
      id: 'saving_1',
      title: 'Savings Base Camp: Building Your Financial Foundation',
      description: 'Establish your financial base camp with smart saving strategies',
      difficulty: 1,
      xpReward: 65,
      coinReward: 16,
      estimatedTime: '5 min',
      content: {
        type: 'interactive',
        sections: [
          {
            type: 'story',
            title: 'The Foundation Story',
            content: 'Maya shows you the solid rock foundation of Base Camp: "Every successful climb starts with a strong foundation. Your savings are like the solid bedrock that everything else builds upon. Without it, the first storm will knock you down."',
            visual: '🗿🏕️⛰️'
          }
        ]
      }
    }
  ]
};

// Worlds endpoint with comprehensive data
app.get('/api/summits', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'budgeting',
        title: 'Budget Base Camp',
        description: 'Start your financial journey at the foundation of money management',
        icon: '🏕️',
        color: 'emerald',
        order: 1,
        isLocked: false,
        lessonsCount: lessonData.budgeting.length,
        estimatedTime: '15 min',
        summitLevel: 'Base Camp',
        elevation: '1,000 ft',
        terrain: 'Gentle slopes perfect for beginners'
      },
      {
        id: 'credit',
        title: 'Credit Cliff Climbing',
        description: 'Scale the challenging terrain of credit scores and debt management',
        icon: '🧗‍♂️',
        color: 'blue',
        order: 2,
        isLocked: false,
        lessonsCount: lessonData.credit.length,
        estimatedTime: '20 min',
        summitLevel: 'Mid-Mountain',
        elevation: '5,000 ft',
        terrain: 'Rocky paths requiring careful navigation'
      },
      {
        id: 'investing',
        title: 'Investment Peak Expedition',
        description: 'Reach new heights by growing your wealth through smart investments',
        icon: '⛰️',
        color: 'purple',
        order: 3,
        isLocked: false,
        lessonsCount: lessonData.investing.length,
        estimatedTime: '25 min',
        summitLevel: 'High Peak',
        elevation: '8,000 ft',
        terrain: 'Advanced trails with rewarding vistas'
      },
      {
        id: 'taxes',
        title: 'Tax Territory Trek',
        description: 'Navigate the complex mountain paths of tax optimization',
        icon: '🗺️',
        color: 'orange',
        order: 4,
        isLocked: true,
        lessonsCount: 0,
        estimatedTime: 'Coming Soon',
        summitLevel: 'Expert Summit',
        elevation: '10,000+ ft',
        terrain: 'Professional-grade expedition routes'
      }
    ]
  });
});

// Keep backwards compatibility for existing API calls
app.get('/api/worlds', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'budgeting',
        title: 'Budget Base Camp',
        description: 'Start your financial journey at the foundation of money management',
        icon: '🏕️',
        color: 'emerald',
        order: 1,
        isLocked: false,
        lessonsCount: lessonData.budgeting.length,
        estimatedTime: '15 min'
      },
      {
        id: 'credit',
        title: 'Credit Cliff Climbing',
        description: 'Scale the challenging terrain of credit scores and debt management',
        icon: '🧗‍♂️',
        color: 'blue',
        order: 2,
        isLocked: false,
        lessonsCount: lessonData.credit.length,
        estimatedTime: '20 min'
      },
      {
        id: 'investing',
        title: 'Investment Peak Expedition',
        description: 'Reach new heights by growing your wealth through smart investments',
        icon: '⛰️',
        color: 'purple',
        order: 3,
        isLocked: false,
        lessonsCount: lessonData.investing.length,
        estimatedTime: '25 min'
      },
      {
        id: 'taxes',
        title: 'Tax Territory Trek',
        description: 'Navigate the complex mountain paths of tax optimization',
        icon: '🗺️',
        color: 'orange',
        order: 4,
        isLocked: true,
        lessonsCount: 0,
        estimatedTime: 'Coming Soon'
      }
    ]
  });
});

// Summit-specific endpoints (new)
app.get('/api/summits/:summitId/lessons', (req, res) => {
  const { summitId } = req.params;
  const lessons = lessonData[summitId as keyof typeof lessonData] || [];
  
  res.json({
    success: true,
    data: lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      difficulty: lesson.difficulty,
      xpReward: lesson.xpReward,
      coinReward: lesson.coinReward,
      estimatedTime: lesson.estimatedTime,
      isCompleted: false // This would come from user progress in a real app
    }))
  });
});

// Lessons endpoints (update to use summit terminology)
app.get('/api/worlds/:worldId/lessons', (req, res) => {
  const { worldId } = req.params;
  const lessons = lessonData[worldId as keyof typeof lessonData] || [];
  
  res.json({
    success: true,
    data: lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      difficulty: lesson.difficulty,
      xpReward: lesson.xpReward,
      coinReward: lesson.coinReward,
      estimatedTime: lesson.estimatedTime,
      isCompleted: false // This would come from user progress in a real app
    }))
  });
});

app.get('/api/lessons/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  
  // Find lesson in any world
  let lesson: any = null;
  for (const worldLessons of Object.values(lessonData)) {
    lesson = worldLessons.find(l => l.id === lessonId);
    if (lesson) break;
  }
  
  if (!lesson) {
    return res.status(404).json({
      success: false,
      error: 'Lesson not found'
    });
  }
  
  res.json({
    success: true,
    data: lesson
  });
});

// Complete lesson endpoint
app.post('/api/lessons/:lessonId/complete', (req, res) => {
  const { lessonId } = req.params;
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'dev_super_secret_jwt_key_change_in_production_123456789';
    const decoded = jwt.verify(token, secret) as any;
    
    // Find user
    const user = Array.from(users.values()).find((u: any) => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Find lesson to get rewards
    let lesson: any = null;
    for (const worldLessons of Object.values(lessonData)) {
      lesson = worldLessons.find(l => l.id === lessonId);
      if (lesson) break;
    }
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }
    
    // Update user progress
    if (!(user as any).completedLessons) (user as any).completedLessons = [];
    if (!(user as any).completedLessons.includes(lessonId)) {
      (user as any).completedLessons.push(lessonId);
      (user as any).xp = ((user as any).xp || 0) + lesson.xpReward;
      (user as any).coins = ((user as any).coins || 0) + lesson.coinReward;
      
      // Level up calculation (every 200 XP = 1 level)
      const newLevel = Math.floor((user as any).xp / 200) + 1;
      const leveledUp = newLevel > ((user as any).level || 1);
      (user as any).level = newLevel;
      
      users.set((user as any).email, user);
      
      res.json({
        success: true,
        data: {
          xpGained: lesson.xpReward,
          coinsGained: lesson.coinReward,
          newXP: (user as any).xp,
          newCoins: (user as any).coins,
          newLevel: (user as any).level,
          leveledUp,
          message: leveledUp ? 'Congratulations! You leveled up!' : 'Lesson completed!'
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          xpGained: 0,
          coinsGained: 0,
          newXP: (user as any).xp,
          newCoins: (user as any).coins,
          newLevel: (user as any).level,
          leveledUp: false,
          message: 'Lesson already completed'
        }
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// Progression map endpoints
app.get('/api/worlds/:worldId/progression', (req, res) => {
  const { worldId } = req.params;
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'dev_super_secret_jwt_key_change_in_production_123456789';
    const decoded = jwt.verify(token, secret) as any;
    
    // Find user
    const user = Array.from(users.values()).find((u: any) => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Get lessons for this world
    const worldLessons = lessonData[worldId as keyof typeof lessonData] || [];
    const completedLessons = (user as any).completedLessons || [];
    
    // Calculate XP earned in this world
    const worldXP = worldLessons
      .filter((lesson: any) => completedLessons.includes(lesson.id))
      .reduce((total: number, lesson: any) => total + lesson.xpReward, 0);
    
    // Define mountain stages based on XP thresholds
    const mountainStages = [
      { stage: 1, name: 'Trailhead', xpRequired: 0, emoji: '🥾', description: 'Starting your journey at the bottom' },
      { stage: 2, name: 'Forest Path', xpRequired: 100, emoji: '🌲', description: 'Learning the basics' },
      { stage: 3, name: 'Rocky Terrain', xpRequired: 250, emoji: '🪨', description: 'Building skills' },
      { stage: 4, name: 'Mountain View', xpRequired: 400, emoji: '🏔️', description: 'Gaining perspective' },
      { stage: 5, name: 'High Ridge', xpRequired: 600, emoji: '⛰️', description: 'Advanced techniques' },
      { stage: 6, name: 'Summit Base', xpRequired: 800, emoji: '🏕️', description: 'Almost there!' },
      { stage: 7, name: 'Peak Master', xpRequired: 1000, emoji: '🏆', description: 'World mastered!' }
    ];
    
    // Find current stage
    let currentStage = mountainStages[0];
    for (const stage of mountainStages) {
      if (worldXP >= stage.xpRequired) {
        currentStage = stage;
      } else {
        break;
      }
    }
    
    // Find next stage
    const nextStageIndex = mountainStages.findIndex(s => s.stage === currentStage.stage + 1);
    const nextStage = nextStageIndex !== -1 ? mountainStages[nextStageIndex] : null;
    
    // Calculate progress to next stage
    const progressToNext = nextStage ? 
      Math.min(100, ((worldXP - currentStage.xpRequired) / (nextStage.xpRequired - currentStage.xpRequired)) * 100) : 100;
    
    res.json({
      success: true,
      data: {
        worldId,
        currentXP: worldXP,
        currentStage,
        nextStage,
        progressToNext: Math.round(progressToNext),
        totalStages: mountainStages.length,
        allStages: mountainStages,
        completedLessons: completedLessons.filter((lessonId: string) => 
          worldLessons.some((lesson: any) => lesson.id === lessonId)
        ).length,
        totalLessons: worldLessons.length
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// Dictionary endpoints
app.get('/api/dictionary', (req, res) => {
  const vocabularyTerms = [
    {
      id: 'budget_def',
      term: 'Budget',
      definition: 'A plan for how to spend and save money over a specific period, typically monthly',
      category: 'Budgeting',
      fromLesson: 'What is a Budget?',
      difficulty: 1
    },
    {
      id: 'income_def',
      term: 'Income',
      definition: 'Money received, especially on a regular basis, from work or investments',
      category: 'Budgeting',
      fromLesson: 'Income vs Expenses',
      difficulty: 1
    },
    {
      id: 'expenses_def',
      term: 'Expenses',
      definition: 'Money spent on goods and services to maintain your lifestyle',
      category: 'Budgeting',
      fromLesson: 'Income vs Expenses',
      difficulty: 1
    },
    {
      id: 'needs_def',
      term: 'Needs',
      definition: 'Essential expenses required for basic living (housing, food, utilities)',
      category: 'Budgeting',
      fromLesson: 'The 50/30/20 Rule',
      difficulty: 1
    },
    {
      id: 'wants_def',
      term: 'Wants',
      definition: "Non-essential expenses that improve quality of life but aren't required",
      category: 'Budgeting',
      fromLesson: 'The 50/30/20 Rule',
      difficulty: 1
    },
    {
      id: 'savings_def',
      term: 'Savings',
      definition: 'Money set aside for future use, emergencies, or long-term goals',
      category: 'Budgeting',
      fromLesson: 'The 50/30/20 Rule',
      difficulty: 1
    },
    {
      id: 'credit_def',
      term: 'Credit',
      definition: 'The ability to borrow money with the promise to pay it back later',
      category: 'Credit',
      fromLesson: 'What is Credit?',
      difficulty: 1
    },
    {
      id: 'credit_score_def',
      term: 'Credit Score',
      definition: 'A numerical rating (300-850) that represents your creditworthiness',
      category: 'Credit',
      fromLesson: 'What is Credit?',
      difficulty: 2
    }
  ];

  res.json({
    success: true,
    data: vocabularyTerms
  });
});

// Simulator endpoints
app.get('/api/simulator/scenarios', (req, res) => {
  const scenarios = [
    {
      id: 'budget_challenge',
      title: 'First Apartment Budget',
      description: 'Navigate the challenge of budgeting for your first apartment. Make choices about rent, utilities, and lifestyle.',
      category: 'Budgeting',
      difficulty: 1,
      estimatedTime: '10-15 min',
      xpReward: 100,
      isAvailable: true
    },
    {
      id: 'emergency_fund',
      title: 'Emergency Fund Builder',
      description: 'Learn to build an emergency fund through real-life scenarios and unexpected expenses.',
      category: 'Saving',
      difficulty: 2,
      estimatedTime: '15-20 min',
      xpReward: 150,
      isAvailable: true
    },
    {
      id: 'investment_journey',
      title: 'Investment Adventure',
      description: 'Start your investment journey with different risk scenarios and market conditions.',
      category: 'Investing',
      difficulty: 3,
      estimatedTime: '20-25 min',
      xpReward: 200,
      isAvailable: false,
      comingSoon: true
    },
    {
      id: 'entrepreneur_path',
      title: "Entrepreneur's Journey",
      description: 'Experience the financial challenges and opportunities of starting your own business.',
      category: 'Entrepreneurship',
      difficulty: 3,
      estimatedTime: '25-30 min',
      xpReward: 250,
      isAvailable: false,
      comingSoon: true
    },
    {
      id: 'retirement_planner',
      title: 'Retirement Planning Quest',
      description: 'Plan for retirement through different life stages and financial decisions.',
      category: 'Retirement',
      difficulty: 2,
      estimatedTime: '20-25 min',
      xpReward: 180,
      isAvailable: false,
      comingSoon: true
    }
  ];

  res.json({
    success: true,
    data: scenarios
  });
});

// User progress endpoint
app.get('/api/user/progress', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'dev_super_secret_jwt_key_change_in_production_123456789';
    const decoded = jwt.verify(token, secret) as any;
    
    // Find user
    const user = Array.from(users.values()).find((u: any) => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    const userProgress = {
      xp: (user as any).xp || 0,
      level: (user as any).level || 1,
      coins: (user as any).coins || 0,
      streak: (user as any).streak || 0,
      completedLessons: (user as any).completedLessons || [],
      completedScenarios: (user as any).completedScenarios || [],
      unlockedWorlds: ['budgeting', 'credit'], // Based on level progression
      achievements: [
        { id: 'first_lesson', name: 'First Steps', earned: ((user as any).completedLessons || []).length > 0 },
        { id: 'budget_master', name: 'Budgeting Beginner', earned: ((user as any).completedLessons || []).filter((l: string) => l.startsWith('budgeting')).length >= 2 },
        { id: 'streak_7', name: 'Streak Master', earned: ((user as any).streak || 0) >= 7 }
      ]
    };

    res.json({
      success: true,
      data: userProgress
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🏔️ Financial Summits API: http://localhost:${PORT}/api/summits`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;