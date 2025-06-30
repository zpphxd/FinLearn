import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { XIcon, TrophyIcon, DollarSignIcon } from 'lucide-react';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  xpReward: number;
  coinReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const todaysChallenge: Challenge = {
  id: 'daily_budget_rule',
  title: 'Budget Rule Challenge',
  description: 'Test your knowledge of the fundamental budgeting rule',
  question: 'According to the 50/30/20 rule, what percentage of your income should go to savings?',
  options: [
    '10%',
    '15%', 
    '20%',
    '25%'
  ],
  correctAnswer: 2,
  explanation: 'The 50/30/20 rule suggests allocating 20% of your income to savings and debt repayment.',
  xpReward: 30,
  coinReward: 10,
  difficulty: 'Easy'
};

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({ isOpen, onClose }) => {
  const { user: _user } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleAnswerSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setHasAnswered(true);
    
    if (selectedAnswer === todaysChallenge.correctAnswer) {
      // Simulate API call to award XP/coins
      setTimeout(() => {
        setIsCompleted(true);
      }, 1000);
    }
  };

  const handleComplete = () => {
    setIsCompleted(false);
    setHasAnswered(false);
    setSelectedAnswer(null);
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <TrophyIcon className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Challenge</h3>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Challenge Content */}
        <div className="p-6">
          {!isCompleted ? (
            <>
              {/* Challenge Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-bold text-gray-900">{todaysChallenge.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(todaysChallenge.difficulty)}`}>
                    {todaysChallenge.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{todaysChallenge.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <TrophyIcon className="h-4 w-4 mr-1" />
                    {todaysChallenge.xpReward} XP
                  </span>
                  <span className="flex items-center">
                    <DollarSignIcon className="h-4 w-4 mr-1" />
                    {todaysChallenge.coinReward} Coins
                  </span>
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">{todaysChallenge.question}</h5>
                
                <div className="space-y-3">
                  {todaysChallenge.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        hasAnswered
                          ? index === todaysChallenge.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-900'
                            : index === selectedAnswer && index !== todaysChallenge.correctAnswer
                            ? 'border-red-500 bg-red-50 text-red-900'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                          : selectedAnswer === index
                          ? 'border-primary-500 bg-primary-50 text-primary-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="font-medium">{option}</span>
                        {hasAnswered && index === todaysChallenge.correctAnswer && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                        {hasAnswered && index === selectedAnswer && index !== todaysChallenge.correctAnswer && (
                          <span className="ml-auto text-red-600">✗</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              {hasAnswered && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h6 className="font-semibold text-blue-900 mb-2">Explanation</h6>
                  <p className="text-blue-800">{todaysChallenge.explanation}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                {!hasAnswered ? (
                  <button
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Answer
                  </button>
                ) : selectedAnswer === todaysChallenge.correctAnswer ? (
                  <button
                    onClick={handleComplete}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Claim Rewards
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Try Again Tomorrow
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Challenge Completed! 🎉</h4>
              <p className="text-gray-600 mb-6">Great job! You've earned your daily rewards.</p>
              
              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">+{todaysChallenge.xpReward}</div>
                  <div className="text-sm text-blue-800">XP</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-yellow-600">+{todaysChallenge.coinReward}</div>
                  <div className="text-sm text-yellow-800">Coins</div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Continue Learning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 