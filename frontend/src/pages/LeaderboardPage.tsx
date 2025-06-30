import React from 'react';

export const LeaderboardPage: React.FC = () => {
  const leaderboardData = [
    { rank: 1, username: 'FinanceGuru23', xp: 25800, streak: 45, avatar: '🏆' },
    { rank: 2, username: 'BudgetMaster', xp: 24200, streak: 32, avatar: '💰' },
    { rank: 3, username: 'InvestorPro', xp: 23650, streak: 28, avatar: '📈' },
    { rank: 4, username: 'DebtFree', xp: 22100, streak: 21, avatar: '💳' },
    { rank: 5, username: 'CryptoSaver', xp: 21800, streak: 19, avatar: '🚀' },
    { rank: 6, username: 'You', xp: 2840, streak: 7, avatar: '👤' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Leaderboard</h1>
        <p className="text-lg text-gray-600">
          See how you rank against other financial learners!
        </p>
      </div>

      <div className="card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Learners This Month</h2>
          
          <div className="space-y-4">
            {leaderboardData.map((user, _index) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  user.username === 'You' 
                    ? 'bg-primary-50 border-primary-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                    user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                    user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {user.rank <= 3 ? user.avatar : user.rank}
                  </div>
                  
                  <div>
                    <div className={`font-medium ${
                      user.username === 'You' ? 'text-primary-900' : 'text-gray-900'
                    }`}>
                      {user.username}
                      {user.username === 'You' && (
                        <span className="ml-2 text-sm text-primary-600">(You)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.streak} day streak
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {user.xp.toLocaleString()} XP
                  </div>
                  <div className="text-sm text-gray-500">
                    Rank #{user.rank}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-blue-800">
              Complete daily challenges and maintain your learning streak to climb the leaderboard!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage; 