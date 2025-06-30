import React, { useState, useEffect } from 'react';

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
}

interface StressLevel {
  financial: number;
  social: number;
  health: number;
  career: number;
}

interface SimulatorScenario {
  title: string;
  description: string;
  initialBudget: number;
  monthlyIncome: number;
  fixedExpenses: number;
  scenarios: ScenarioStep[];
  categories: BudgetCategory[];
}

interface ScenarioStep {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
  stressImpact?: Partial<StressLevel>;
  timeOfMonth: number; // 1-30 (day of month)
}

interface Choice {
  text: string;
  cost: number;
  points: number;
  consequence: string;
  stressImpact?: Partial<StressLevel>;
  categoryImpact?: { [category: string]: number };
}

interface InteractiveSimulatorProps {
  scenarioId: string;
  onClose: () => void;
}

const BUDGET_SCENARIOS: { [key: string]: SimulatorScenario } = {
  'first-apartment': {
    title: '🏠 Your First Apartment Adventure',
    description: 'Navigate 3 months of independent living with $4,500/month income and real-world financial challenges!',
    initialBudget: 4500,
    monthlyIncome: 4500,
    fixedExpenses: 2800,
    categories: [
      { name: 'Housing', allocated: 1800, spent: 0, icon: '🏠', color: 'bg-blue-500' },
      { name: 'Transportation', allocated: 400, spent: 0, icon: '🚗', color: 'bg-green-500' },
      { name: 'Food', allocated: 600, spent: 0, icon: '🍕', color: 'bg-yellow-500' },
      { name: 'Entertainment', allocated: 300, spent: 0, icon: '🎮', color: 'bg-purple-500' },
      { name: 'Emergency Fund', allocated: 200, spent: 0, icon: '💰', color: 'bg-red-500' },
      { name: 'Miscellaneous', allocated: 200, spent: 0, icon: '🛍️', color: 'bg-pink-500' }
    ],
    scenarios: [
      {
        id: 'deposit',
        title: 'Security Deposit Crisis',
        description: "You've found the perfect apartment! But the landlord wants first month's rent ($1,200) AND a security deposit ($1,200) upfront. You only planned for $1,500 total move-in costs.",
        timeOfMonth: 1,
        choices: [
          {
            text: 'Pay the full $2,400 and eat ramen for weeks',
            cost: 2400,
            points: 15,
            consequence: 'You secured the apartment but your food budget is shot.',
            categoryImpact: { 'Housing': 2400, 'Food': -200 },
            stressImpact: { financial: 20, health: 10 }
          },
          {
            text: 'Ask family for help with the deposit',
            cost: 1200,
            points: 5,
            consequence: 'Family helped but you feel guilty about borrowing money.',
            categoryImpact: { 'Housing': 1200 },
            stressImpact: { social: 15, financial: -5 }
          },
          {
            text: 'Look for a cheaper place with lower deposit',
            cost: 1800,
            points: 10,
            consequence: 'Found a place in a sketchy neighborhood, but it fits your budget.',
            categoryImpact: { 'Housing': 1800 },
            stressImpact: { financial: -10, health: 15 }
          }
        ]
      },
      {
        id: 'utilities',
        title: 'Utility Setup Nightmare',
        description: "Setting up utilities is expensive! Electric company wants $200 deposit, internet is $80/month, and you need to pay for water/gas hookup ($150). Your utilities budget was only $200 total.",
        timeOfMonth: 3,
        choices: [
          {
            text: 'Pay all deposits and get premium internet',
            cost: 430,
            points: 5,
            consequence: 'Great internet but you overspent on utilities setup.',
            categoryImpact: { 'Housing': 430 },
            stressImpact: { financial: 15 }
          },
          {
            text: 'Get basic internet and negotiate payment plans',
            cost: 280,
            points: 12,
            consequence: 'Slower internet but managed costs better.',
            categoryImpact: { 'Housing': 280 },
            stressImpact: { financial: 5 }
          },
          {
            text: 'Use mobile hotspot and pay only essential deposits',
            cost: 200,
            points: 8,
            consequence: 'Saved money but working from home is challenging.',
            categoryImpact: { 'Housing': 200 },
            stressImpact: { career: 10, financial: -5 }
          }
        ]
      },
      {
        id: 'car_trouble',
        title: 'Car Breakdown Drama',
        description: "Your car won't start! The mechanic says it needs $800 in repairs. You could also take public transport ($120/month) or rideshare everywhere ($300/month).",
        timeOfMonth: 8,
        choices: [
          {
            text: 'Fix the car immediately',
            cost: 800,
            points: 10,
            consequence: 'Car is reliable again but your emergency fund is depleted.',
            categoryImpact: { 'Transportation': 800, 'Emergency Fund': -400 },
            stressImpact: { financial: 25 }
          },
          {
            text: 'Use public transport for now',
            cost: 120,
            points: 15,
            consequence: 'Saving money but commute takes twice as long.',
            categoryImpact: { 'Transportation': 120 },
            stressImpact: { career: 5, financial: -10 }
          },
          {
            text: 'Mix of rideshare and borrowing friends\' cars',
            cost: 250,
            points: 7,
            consequence: 'Flexible but expensive, and you owe favors.',
            categoryImpact: { 'Transportation': 250 },
            stressImpact: { social: 15, financial: 10 }
          }
        ]
      },
      {
        id: 'grocery_shock',
        title: 'Grocery Bill Reality Check',
        description: "Your first grocery trip was $180! You thought $100 would be enough for two weeks. Now you need to figure out how to eat for the rest of the month.",
        timeOfMonth: 12,
        choices: [
          {
            text: 'Keep shopping normally, adjust other categories',
            cost: 340,
            points: 2,
            consequence: 'Eating well but overspending on food.',
            categoryImpact: { 'Food': 340, 'Entertainment': -100 },
            stressImpact: { health: -5, social: 10 }
          },
          {
            text: 'Learn to cook, shop sales, use coupons',
            cost: 220,
            points: 20,
            consequence: 'Developing great cooking skills and staying on budget!',
            categoryImpact: { 'Food': 220 },
            stressImpact: { health: 5, financial: -10 }
          },
          {
            text: 'Eat out less, meal prep, rice and beans',
            cost: 160,
            points: 12,
            consequence: 'Saving money but getting tired of simple meals.',
            categoryImpact: { 'Food': 160 },
            stressImpact: { health: -5, financial: -5 }
          }
        ]
      },
      {
        id: 'social_pressure',
        title: 'Social Life vs Budget',
        description: "Friends invite you to an expensive weekend trip ($400), birthday dinner ($80), and concert tickets ($120). You budgeted $300 for entertainment this month.",
        timeOfMonth: 15,
        choices: [
          {
            text: 'Say yes to everything, YOLO!',
            cost: 600,
            points: -5,
            consequence: 'Great memories but terrible for your budget.',
            categoryImpact: { 'Entertainment': 600 },
            stressImpact: { social: -20, financial: 30 }
          },
          {
            text: 'Pick one event and suggest cheaper alternatives',
            cost: 200,
            points: 15,
            consequence: 'Balanced social life and budget responsibility.',
            categoryImpact: { 'Entertainment': 200 },
            stressImpact: { social: 5, financial: -5 }
          },
          {
            text: 'Decline everything and save money',
            cost: 50,
            points: 5,
            consequence: 'Budget intact but feeling isolated from friends.',
            categoryImpact: { 'Entertainment': 50 },
            stressImpact: { social: 25, financial: -15 }
          }
        ]
      },
      {
        id: 'work_clothes',
        title: 'Professional Wardrobe Emergency',
        description: "Your boss mentions the dress code. You need professional clothes but only have casual wear. A basic work wardrobe costs $600, but you could try thrift stores or budget alternatives.",
        timeOfMonth: 20,
        choices: [
          {
            text: 'Buy quality professional clothes at full price',
            cost: 600,
            points: 8,
            consequence: 'Looking sharp but your miscellaneous budget is gone.',
            categoryImpact: { 'Miscellaneous': 600 },
            stressImpact: { career: -15, financial: 20 }
          },
          {
            text: 'Mix of thrift stores and budget retailers',
            cost: 250,
            points: 15,
            consequence: 'Found great deals and staying within budget.',
            categoryImpact: { 'Miscellaneous': 250 },
            stressImpact: { career: -5, financial: 5 }
          },
          {
            text: 'Borrow clothes and gradually build wardrobe',
            cost: 100,
            points: 10,
            consequence: 'Slow progress but smart financial planning.',
            categoryImpact: { 'Miscellaneous': 100 },
            stressImpact: { career: 5, social: 10 }
          }
        ]
      },
      {
        id: 'medical_bill',
        title: 'Unexpected Medical Expense',
        description: "You got sick and had to visit urgent care. The bill is $350 after insurance. You don't have health savings, and this wasn't in your budget.",
        timeOfMonth: 25,
        choices: [
          {
            text: 'Pay the full bill immediately',
            cost: 350,
            points: 5,
            consequence: 'Debt-free but stressed about the unexpected expense.',
            categoryImpact: { 'Emergency Fund': 350 },
            stressImpact: { health: -5, financial: 15 }
          },
          {
            text: 'Set up a payment plan with the clinic',
            cost: 120,
            points: 12,
            consequence: 'Manageable payments but ongoing obligation.',
            categoryImpact: { 'Emergency Fund': 120 },
            stressImpact: { financial: 8, health: 5 }
          },
          {
            text: 'Put it on a credit card to deal with later',
            cost: 0,
            points: -10,
            consequence: 'Immediate relief but debt is accumulating.',
            stressImpact: { financial: 25, health: 10 }
          }
        ]
      },
      {
        id: 'month_end',
        title: 'End of Month 1 - Rent is Due Again!',
        description: "Month 1 is over and rent ($1,200) is due again. How did you do? Time to analyze your spending and prepare for month 2.",
        timeOfMonth: 30,
        choices: [
          {
            text: 'Pay rent and continue with same budget strategy',
            cost: 1200,
            points: 10,
            consequence: 'Consistency is key to long-term financial success.',
            categoryImpact: { 'Housing': 1200 }
          },
          {
            text: 'Pay rent and adjust categories based on learning',
            cost: 1200,
            points: 15,
            consequence: 'Adapting your budget shows financial maturity.',
            categoryImpact: { 'Housing': 1200 },
            stressImpact: { financial: -10 }
          },
          {
            text: 'Pay rent late to manage cash flow',
            cost: 1250,
            points: -5,
            consequence: 'Late fees are adding up - this is unsustainable.',
            categoryImpact: { 'Housing': 1250 },
            stressImpact: { financial: 20 }
          }
        ]
      },
      {
        id: 'month2_start',
        title: 'Month 2: Income Received!',
        description: "Good news! Your second paycheck arrived ($4,500). But you've learned that budgeting isn't just about the big expenses - it's the little things that add up.",
        timeOfMonth: 31,
        choices: [
          {
            text: 'Immediately allocate all money to categories',
            cost: 0,
            points: 15,
            consequence: 'Organization and planning prevent overspending.',
            stressImpact: { financial: -15 }
          },
          {
            text: 'Keep some money unallocated for flexibility',
            cost: 0,
            points: 10,
            consequence: 'Buffer money helps with unexpected expenses.',
            stressImpact: { financial: -5 }
          },
          {
            text: 'Spend freely since you have fresh money',
            cost: 200,
            points: -5,
            consequence: 'Without planning, money disappears quickly.',
            categoryImpact: { 'Miscellaneous': 200 },
            stressImpact: { financial: 10 }
          }
        ]
      },
      {
        id: 'subscription_trap',
        title: 'The Subscription Trap',
        description: "You signed up for Netflix ($15), Spotify ($10), gym membership ($45), and food delivery ($12/month). These 'small' monthly costs add up to $82/month or $984/year!",
        timeOfMonth: 35,
        choices: [
          {
            text: 'Keep all subscriptions, they\'re worth it',
            cost: 82,
            points: 0,
            consequence: 'Convenient but expensive lifestyle choices.',
            categoryImpact: { 'Entertainment': 82 },
            stressImpact: { financial: 5 }
          },
          {
            text: 'Cancel half and find free alternatives',
            cost: 40,
            points: 12,
            consequence: 'Found great free apps and local gym options.',
            categoryImpact: { 'Entertainment': 40 },
            stressImpact: { financial: -5, health: 5 }
          },
          {
            text: 'Cancel everything and go completely free',
            cost: 0,
            points: 8,
            consequence: 'Saving money but missing some conveniences.',
            stressImpact: { financial: -10, social: 10 }
          }
        ]
      },
      {
        id: 'friend_emergency',
        title: 'Friend in Financial Crisis',
        description: "Your best friend lost their job and needs to borrow $500 for rent. They promise to pay you back, but you know their financial track record isn't great.",
        timeOfMonth: 42,
        choices: [
          {
            text: 'Lend the money immediately, no questions asked',
            cost: 500,
            points: 5,
            consequence: 'Good friend but risky financial decision.',
            categoryImpact: { 'Emergency Fund': 500 },
            stressImpact: { social: -10, financial: 25 }
          },
          {
            text: 'Lend $200 and help them find resources',
            cost: 200,
            points: 15,
            consequence: 'Supportive but responsible approach.',
            categoryImpact: { 'Emergency Fund': 200 },
            stressImpact: { social: -5, financial: 10 }
          },
          {
            text: 'Offer non-financial help only',
            cost: 0,
            points: 10,
            consequence: 'Protected your finances but relationship is strained.',
            stressImpact: { social: 15, financial: -5 }
          }
        ]
      },
      {
        id: 'opportunity_cost',
        title: 'Investment Opportunity',
        description: "A coworker offers you a chance to invest $1,000 in their startup. It could double your money or you could lose it all. Your emergency fund has grown to $800.",
        timeOfMonth: 50,
        choices: [
          {
            text: 'Invest your entire emergency fund',
            cost: 800,
            points: -10,
            consequence: 'High risk, high reward - but no safety net left.',
            categoryImpact: { 'Emergency Fund': 800 },
            stressImpact: { financial: 35, career: -5 }
          },
          {
            text: 'Invest only $200 from miscellaneous budget',
            cost: 200,
            points: 12,
            consequence: 'Conservative investment approach.',
            categoryImpact: { 'Miscellaneous': 200 },
            stressImpact: { financial: 5, career: -5 }
          },
          {
            text: 'Decline and keep building emergency fund',
            cost: 0,
            points: 15,
            consequence: 'Prioritizing financial security over speculation.',
            stressImpact: { financial: -10 }
          }
        ]
      },
      {
        id: 'final_month',
        title: 'Month 3: The Final Challenge',
        description: "You've made it to your final month! Rent is due ($1,200), and you want to celebrate your independence. How will you finish strong?",
        timeOfMonth: 60,
        choices: [
          {
            text: 'Throw a housewarming party ($300)',
            cost: 1500,
            points: 8,
            consequence: 'Great celebration but expensive end to the challenge.',
            categoryImpact: { 'Housing': 1200, 'Entertainment': 300 },
            stressImpact: { social: -15, financial: 15 }
          },
          {
            text: 'Pay rent and have a small dinner with close friends ($80)',
            cost: 1280,
            points: 15,
            consequence: 'Balanced celebration and responsible spending.',
            categoryImpact: { 'Housing': 1200, 'Entertainment': 80 },
            stressImpact: { social: -5, financial: 5 }
          },
          {
            text: 'Pay rent and put remaining money in savings',
            cost: 1200,
            points: 20,
            consequence: 'Strong finish with increased financial security.',
            categoryImpact: { 'Housing': 1200 },
            stressImpact: { financial: -20 }
          }
        ]
      }
    ]
  }
};

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({ scenarioId, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [budget, setBudget] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [stressLevels, setStressLevels] = useState<StressLevel>({
    financial: 10,
    social: 5,
    health: 5,
    career: 5
  });
  const [month, setMonth] = useState(1);

  const scenario = BUDGET_SCENARIOS[scenarioId];

  useEffect(() => {
    if (scenario) {
      setBudget(scenario.initialBudget);
      setCategories(scenario.categories);
    }
  }, [scenario]);

  const handleChoice = (choice: Choice) => {
    const newBudget = budget - choice.cost;
    const newScore = score + choice.points;
    
    setBudget(newBudget);
    setScore(newScore);
    setHistory(prev => [...prev, choice.consequence]);

    // Update categories
    if (choice.categoryImpact) {
      setCategories(prev => prev.map(cat => ({
        ...cat,
        spent: cat.spent + (choice.categoryImpact?.[cat.name] || 0)
      })));
    }

    // Update stress levels
    if (choice.stressImpact) {
      setStressLevels(prev => ({
        financial: Math.max(0, Math.min(100, prev.financial + (choice.stressImpact?.financial || 0))),
        social: Math.max(0, Math.min(100, prev.social + (choice.stressImpact?.social || 0))),
        health: Math.max(0, Math.min(100, prev.health + (choice.stressImpact?.health || 0))),
        career: Math.max(0, Math.min(100, prev.career + (choice.stressImpact?.career || 0)))
      }));
    }

    // Check if starting new month
    const currentScenario = scenario.scenarios[currentStep];
    const nextScenario = scenario.scenarios[currentStep + 1];
    if (nextScenario && Math.floor(nextScenario.timeOfMonth / 30) > Math.floor(currentScenario.timeOfMonth / 30)) {
      setMonth(prev => prev + 1);
      setBudget(prev => prev + scenario.monthlyIncome);
    }

    if (currentStep < scenario.scenarios.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const getScoreMessage = () => {
    if (score >= 120) return "🏆 Financial Genius! You've mastered independent living!";
    if (score >= 80) return "🎉 Excellent! You're ready for financial independence!";
    if (score >= 40) return "👏 Great job! You've learned valuable money management skills.";
    if (score >= 0) return "👍 Good effort! Keep practicing your budgeting skills.";
    return "💡 Every financial mistake is a learning opportunity!";
  };

  const getBudgetColor = () => {
    if (budget > 2000) return "text-green-600";
    if (budget > 500) return "text-yellow-600";
    return "text-red-600";
  };

  const getStressColor = (level: number) => {
    if (level <= 20) return "bg-green-500";
    if (level <= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (!scenario) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Scenario Not Found</h3>
          <p className="text-gray-600 mb-6">The requested simulation scenario could not be loaded.</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex">
        {/* Sidebar - Budget Tracking */}
        <div className="w-80 bg-gray-50 border-r overflow-y-auto">
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h3 className="font-bold text-lg">📊 Financial Dashboard</h3>
            <p className="text-sm text-blue-100">Month {month} Progress</p>
          </div>
          
          {/* Budget Overview */}
          <div className="p-4 border-b">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Available</span>
                <span className={`text-lg font-bold ${getBudgetColor()}`}>
                  ${budget.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Score</span>
                <span className="text-lg font-bold text-purple-600">{score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-lg font-bold text-blue-600">
                  {isComplete ? 'Complete!' : `${currentStep + 1}/${scenario.scenarios.length}`}
                </span>
              </div>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="p-4 border-b">
            <h4 className="font-semibold text-gray-900 mb-3">💰 Budget Categories</h4>
            <div className="space-y-3">
              {categories.map((category, index) => {
                const remaining = category.allocated - category.spent;
                const percentSpent = (category.spent / category.allocated) * 100;
                return (
                  <div key={index} className="bg-white rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className={`text-sm font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${remaining}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${category.color} ${percentSpent > 100 ? 'bg-red-500' : ''}`}
                        style={{ width: `${Math.min(percentSpent, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ${category.spent} / ${category.allocated}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stress Levels */}
          <div className="p-4 border-b">
            <h4 className="font-semibold text-gray-900 mb-3">😰 Stress Levels</h4>
            <div className="space-y-3">
              {Object.entries(stressLevels).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm capitalize">{key}</span>
                    <span className="text-sm font-bold">{value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getStressColor(value)}`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Decisions */}
          {history.length > 0 && (
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">📝 Recent Decisions</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {history.slice(-4).map((item, index) => (
                  <div key={index} className="text-xs text-gray-600 bg-white rounded p-2">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">{scenario.title}</h2>
                <p className="text-blue-100">{scenario.description}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {!isComplete ? (
              <div className="space-y-6 max-w-4xl">
                {/* Current Scenario */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {scenario.scenarios[currentStep].title}
                    </h3>
                    <div className="text-sm text-gray-500">
                      Day {scenario.scenarios[currentStep].timeOfMonth}
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {scenario.scenarios[currentStep].description}
                  </p>
                </div>

                {/* Choices */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg">🤔 What's your move?</h4>
                  {scenario.scenarios[currentStep].choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleChoice(choice)}
                      className="w-full text-left p-6 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <div className="font-medium text-gray-900 group-hover:text-blue-700 text-lg mb-2">
                            {choice.text}
                          </div>
                          <div className="text-sm text-gray-600 italic">
                            "{choice.consequence}"
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xl font-bold text-red-600 mb-1">
                            -${choice.cost.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {choice.points > 0 ? `+${choice.points}` : choice.points} pts
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Results Screen */
              <div className="text-center space-y-8 max-w-3xl mx-auto">
                <div className="text-8xl">🎯</div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">3-Month Challenge Complete!</h3>
                  <p className="text-xl text-gray-600">{getScoreMessage()}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Final Budget</h4>
                    <div className="text-3xl font-bold text-green-600 mb-2">${budget.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Money Remaining</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Final Score</h4>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{score}</div>
                    <div className="text-sm text-gray-600">Decision Points</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Decisions Made</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{history.length}</div>
                    <div className="text-sm text-gray-600">Financial Choices</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4">🎓 Key Lessons Learned</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <div className="text-sm">✅ Budget categories help track spending</div>
                      <div className="text-sm">✅ Emergency funds are crucial for unexpected costs</div>
                      <div className="text-sm">✅ Small expenses add up quickly</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">✅ Social pressure can impact financial decisions</div>
                      <div className="text-sm">✅ Planning ahead prevents overspending</div>
                      <div className="text-sm">✅ Every financial choice has consequences</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg"
                >
                  🏔️ Continue Your Financial Summit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 