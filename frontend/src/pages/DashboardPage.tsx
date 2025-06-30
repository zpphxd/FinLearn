import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DailyChallengeModal } from './DailyChallengeModal';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);

  if (!user) return null;

  const progressData = [
    { world: 'Budgeting', progress: 80, emoji: '💰' },
    { world: 'Credit & Debt', progress: 45, emoji: '💳' },
    { world: 'Investing', progress: 20, emoji: '📈' },
    { world: 'Tax Mastery', progress: 0, emoji: '📋' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.username}! 👋
        </h1>
        <p className="text-primary-100 mb-4">
          Ready to continue your financial journey? You're doing great!
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{user.level}</div>
            <div className="text-sm text-primary-100">Level</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{user.xp.toLocaleString()}</div>
            <div className="text-sm text-primary-100">Total XP</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{user.coins.toLocaleString()}</div>
            <div className="text-sm text-primary-100">Coins</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{user.streak}</div>
            <div className="text-sm text-primary-100">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/app/worlds" className="card hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Continue Learning</h3>
            <p className="text-gray-600 text-sm">
              Pick up where you left off in your financial education journey
            </p>
          </div>
        </Link>

        <div className="card">
          <div className="p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Challenge</h3>
            <p className="text-gray-600 text-sm mb-3">
              Complete today's challenge to keep your streak going!
            </p>
            <button 
              onClick={() => setIsDailyChallengeOpen(true)}
              className="btn btn-primary btn-sm"
            >
              Start Challenge
            </button>
          </div>
        </div>

        <Link to="/app/profile" className="card hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Achievements</h3>
            <p className="text-gray-600 text-sm mb-3">
              View your badges and unlock new milestones
            </p>
            <div className="text-primary-600 text-sm font-medium">View Achievements →</div>
          </div>
        </Link>
      </div>

      {/* Progress Overview */}
      <div className="card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
          <div className="space-y-4">
            {progressData.map((item) => (
              <div key={item.world} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="font-medium text-gray-900">{item.world}</div>
                    <div className="text-sm text-gray-500">{item.progress}% complete</div>
                  </div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
                <Link
                  to="/app/worlds"
                  className="btn btn-outline btn-sm"
                >
                  Continue
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <span className="text-success-600 text-xs">✓</span>
              </div>
              <div className="flex-1">
                <div className="text-gray-900">Completed "What is a Budget?"</div>
                <div className="text-gray-500">+50 XP • 2 hours ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                <span className="text-warning-600 text-xs">🎯</span>
              </div>
              <div className="flex-1">
                <div className="text-gray-900">Earned "Budgeting Beginner" badge</div>
                <div className="text-gray-500">Yesterday</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-xs">🔥</span>
              </div>
              <div className="flex-1">
                <div className="text-gray-900">Maintained 7-day learning streak</div>
                <div className="text-gray-500">3 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge Modal */}
      <DailyChallengeModal 
        isOpen={isDailyChallengeOpen}
        onClose={() => setIsDailyChallengeOpen(false)}
      />
    </div>
  );
};

export default DashboardPage; 