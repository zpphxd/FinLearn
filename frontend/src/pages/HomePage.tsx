import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleWatchDemo = async () => {
    setIsLoading(true);
    try {
      await login('demo@finlearn.com', 'demo123');
      navigate('/app');
    } catch (error) {
      console.error('Demo login failed:', error);
      alert('Demo is temporarily unavailable. Please try registering a new account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">⛰️</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">FinLearn</span>
                <span className="text-xs text-gray-500 block leading-none">Financial Summits</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Climb
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Mountain Background Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute bottom-0 left-1/4 w-64 h-32 bg-gradient-to-t from-gray-300 to-gray-200 opacity-20 transform rotate-12 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-gradient-to-t from-blue-300 to-blue-200 opacity-15 transform -rotate-12 rounded-full blur-xl"></div>
            </div>
            
            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                Conquer Your{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Financial Summit
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto leading-relaxed">
                Embark on an epic journey to financial mastery. Scale the peaks of budgeting, 
                navigate credit cliffs, and reach the summit of financial independence.
              </p>
              
              <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
                🏔️ Every lesson is a step higher • 🎯 Real-world challenges await • 🏆 Achieve financial freedom
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  🚀 Begin Your Expedition
                </Link>
                <button 
                  onClick={handleWatchDemo}
                  disabled={isLoading}
                  className="btn btn-secondary btn-lg px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {isLoading ? '⏳ Loading Base Camp...' : '👀 Explore Base Camp'}
                </button>
              </div>
            </div>

            {/* Mountain Climbing Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-20 relative z-10">
              <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl">🎮</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Gamified Ascent</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Earn altitude points, collect summit badges, and unlock new territories as you master each financial peak
                </p>
              </div>

              <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl">⛰️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Trail-sized Learning</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Bite-sized expeditions that fit your schedule - from budget base camps to investment peaks
                </p>
              </div>

              <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Real Summit Challenges</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Navigate treacherous financial terrain with simulations that prepare you for real-world adventures
                </p>
              </div>
            </div>

            {/* Financial Summits Preview */}
            <div className="mt-24 relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                🏔️ Financial Summits to Conquer
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Each summit builds upon the last, creating your path to financial mastery
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { emoji: '🏕️', name: 'Budget Base Camp', elevation: '1,000 ft', difficulty: 'Beginner' },
                  { emoji: '🧗‍♂️', name: 'Credit Cliffs', elevation: '3,500 ft', difficulty: 'Intermediate' },
                  { emoji: '⛰️', name: 'Investment Peaks', elevation: '8,000 ft', difficulty: 'Advanced' },
                  { emoji: '🗺️', name: 'Tax Territory', elevation: '10,000 ft', difficulty: 'Expert' },
                  { emoji: '🛡️', name: 'Insurance Ridge', elevation: '6,500 ft', difficulty: 'Intermediate' },
                  { emoji: '🏖️', name: 'Retirement Valley', elevation: '7,200 ft', difficulty: 'Advanced' },
                  { emoji: '🏠', name: 'Real Estate Summit', elevation: '9,500 ft', difficulty: 'Expert' },
                  { emoji: '🎯', name: 'Freedom Peak', elevation: '12,000 ft', difficulty: 'Master' },
                ].map((summit, index) => (
                  <div
                    key={summit.name}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-white/20"
                  >
                    <div className="text-4xl mb-3">{summit.emoji}</div>
                    <div className="text-lg font-bold text-gray-900 mb-2">{summit.name}</div>
                    <div className="text-sm text-gray-600 mb-1">{summit.elevation}</div>
                    <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {summit.difficulty}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-24 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-6">Ready to Start Your Financial Expedition?</h2>
                <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                  Join thousands of climbers who've reached their financial summits. Your journey to financial freedom starts with a single step.
                </p>
                <Link
                  to="/register"
                  className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  🎒 Pack Your Gear & Start Climbing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage; 