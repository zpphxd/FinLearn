import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const achievements = [
    { name: 'First Steps', description: 'Completed your first lesson', earned: true, icon: '🎯' },
    { name: 'Budgeting Beginner', description: 'Completed 5 budgeting lessons', earned: true, icon: '💰' },
    { name: 'Streak Master', description: 'Maintained a 7-day streak', earned: true, icon: '🔥' },
    { name: 'Credit Wise', description: 'Completed credit basics world', earned: false, icon: '💳' },
    { name: 'Investment Explorer', description: 'Started investing world', earned: false, icon: '📈' },
    { name: 'Tax Pro', description: 'Completed tax mastery world', earned: false, icon: '📋' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Profile</h1>
        <p className="text-lg text-gray-600">
          Track your progress and manage your account settings
        </p>
      </div>

      {/* User Info */}
      <div className="card">
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.username}</h2>
              <p className="text-gray-600 mb-3">{user.email}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary-600">{user.level}</div>
                  <div className="text-sm text-gray-500">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-success-600">{user.xp.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-warning-600">{user.coins.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Coins</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">{user.streak}</div>
                  <div className="text-sm text-gray-500">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lessons Completed</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Worlds Unlocked</span>
                <span className="font-medium">3 / 8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Perfect Scores</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Study Time</span>
                <span className="font-medium">8.5 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account Created</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full btn btn-outline text-left">
                <span>🔔</span>
                <span className="ml-2">Notification Settings</span>
              </button>
              <button className="w-full btn btn-outline text-left">
                <span>🎯</span>
                <span className="ml-2">Set Daily Goal</span>
              </button>
              <button className="w-full btn btn-outline text-left">
                <span>📊</span>
                <span className="ml-2">Download Progress Report</span>
              </button>
              <button className="w-full btn btn-outline text-left">
                <span>🔒</span>
                <span className="ml-2">Change Password</span>
              </button>
              <button className="w-full btn btn-outline text-left">
                <span>❓</span>
                <span className="ml-2">Help & Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.name}
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned
                    ? 'border-success-200 bg-success-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-success-900' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-success-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="text-success-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 