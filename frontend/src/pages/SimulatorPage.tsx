import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { InteractiveSimulator } from '../components/InteractiveSimulator';
import { 
  GamepadIcon, 
  DollarSignIcon, 
  TrendingUpIcon, 
  HomeIcon,
  GraduationCapIcon,
  PiggyBankIcon,
  MessageCircleIcon,
  PlayIcon
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  difficulty: number;
  estimatedTime: string;
  xpReward: number;
  isAvailable: boolean;
  comingSoon?: boolean;
}

const scenarios: Scenario[] = [
  {
    id: 'first-apartment',
    title: 'First Apartment Budget',
    description: 'Navigate the challenge of budgeting for your first apartment. Make choices about rent, utilities, and lifestyle.',
    icon: HomeIcon,
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
    icon: PiggyBankIcon,
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
    icon: TrendingUpIcon,
    category: 'Investing',
    difficulty: 3,
    estimatedTime: '20-25 min',
    xpReward: 200,
    isAvailable: false,
    comingSoon: true
  },
  {
    id: 'entrepreneur_path',
    title: 'Entrepreneur\'s Journey',
    description: 'Experience the financial challenges and opportunities of starting your own business.',
    icon: GraduationCapIcon,
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
    icon: DollarSignIcon,
    category: 'Retirement',
    difficulty: 2,
    estimatedTime: '20-25 min',
    xpReward: 180,
    isAvailable: false,
    comingSoon: true
  }
];

export const SimulatorPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  const handleStartScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setIsChatOpen(true);
  };

  const handleCloseSimulator = () => {
    setSelectedScenario(null);
    setIsChatOpen(false);
  };

  const availableScenarios = scenarios.filter(s => s.isAvailable);
  const comingSoonScenarios = scenarios.filter(s => s.comingSoon);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <GamepadIcon className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Financial Simulator</h1>
        </div>
        <p className="text-gray-600">
          Practice real-world financial decisions through interactive scenarios and AI-guided adventures.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-primary-600">{availableScenarios.length}</div>
          <div className="text-sm text-gray-600">Available Scenarios</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-600">XP Earned</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-purple-600">{comingSoonScenarios.length}</div>
          <div className="text-sm text-gray-600">Coming Soon</div>
        </div>
      </div>

      {/* Available Scenarios */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableScenarios.map((scenario) => {
            const IconComponent = scenario.icon;
            return (
              <div key={scenario.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-primary-100 rounded-lg mr-4">
                      <IconComponent className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
                      <span className="text-sm text-gray-500">{scenario.category}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                    {getDifficultyLabel(scenario.difficulty)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {scenario.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{scenario.estimatedTime}</span>
                    <span>{scenario.xpReward} XP</span>
                  </div>
                  <button
                    onClick={() => handleStartScenario(scenario.id)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Start
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coming Soon Scenarios */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonScenarios.map((scenario) => {
            const IconComponent = scenario.icon;
            return (
              <div key={scenario.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-gray-200 rounded-lg mr-4">
                      <IconComponent className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">{scenario.title}</h3>
                      <span className="text-sm text-gray-500">{scenario.category}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                    Coming Soon
                  </span>
                </div>
                
                <p className="text-gray-500 mb-4 leading-relaxed">
                  {scenario.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{scenario.estimatedTime}</span>
                    <span>{scenario.xpReward} XP</span>
                  </div>
                  <button
                    disabled
                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Coming Soon
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Simulator */}
      {isChatOpen && selectedScenario && (
        <InteractiveSimulator 
          scenarioId={selectedScenario} 
          onClose={handleCloseSimulator}
        />
      )}
    </div>
  );
}; 