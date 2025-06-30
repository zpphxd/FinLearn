import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatNumber } from '../../types';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/app" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FinLearn</span>
          </Link>

          {/* User Stats */}
          <div className="flex items-center space-x-6">
            {/* XP */}
            <div className="flex items-center space-x-2">
              <div className="xp-badge">
                <span className="text-primary-600">⚡</span>
                <span>{formatNumber(user.xp)} XP</span>
              </div>
            </div>

            {/* Coins */}
            <div className="flex items-center space-x-2">
              <div className="coin-badge">
                <span className="text-warning-600">🪙</span>
                <span>{formatNumber(user.coins)}</span>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <span className="streak-flame">🔥</span>
                <span>{user.streak} day streak</span>
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center space-x-2">
              <div className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                Level {user.level}
              </div>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                title="Logout"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 