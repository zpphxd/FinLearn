import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { MountainProgression } from '../components/MountainProgression';

interface World {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isLocked: boolean;
  lessonsCount: number;
  estimatedTime: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  xpReward: number;
  coinReward: number;
  estimatedTime: string;
  isCompleted: boolean;
}

export const WorldsPage: React.FC = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [progressionModalOpen, setProgressionModalOpen] = useState(false);
  const [progressionWorldId, setProgressionWorldId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const response = await apiClient.get('/worlds');
        setWorlds(response.data.data);
      } catch (error) {
        console.error('Failed to fetch worlds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorlds();
  }, []);

  const fetchLessons = async (worldId: string) => {
    setLessonsLoading(true);
    try {
      const response = await apiClient.get(`/worlds/${worldId}/lessons`);
      setLessons(response.data.data);
      setSelectedWorld(worldId);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      setLessons([]);
    } finally {
      setLessonsLoading(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      emerald: 'from-emerald-500 to-emerald-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      teal: 'from-teal-500 to-teal-600',
      indigo: 'from-indigo-500 to-indigo-600',
      yellow: 'from-yellow-500 to-yellow-600',
    };
    return colorMap[color] || 'from-gray-500 to-gray-600';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty === 1) return { label: 'Beginner', color: 'bg-green-100 text-green-800' };
    if (difficulty === 2) return { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Advanced', color: 'bg-red-100 text-red-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading worlds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Financial Learning Worlds</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master your financial future by completing all worlds. Each world contains 
          bite-sized lessons designed to build your financial literacy step by step.
        </p>
      </div>

      {/* Worlds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {worlds.map((world) => (
          <div
            key={world.id}
            className={`card overflow-hidden ${
              !world.isLocked ? 'hover:shadow-lg transition-shadow cursor-pointer' : 'opacity-60'
            }`}
            onClick={() => !world.isLocked && fetchLessons(world.id)}
          >
            {/* World Header */}
            <div className={`bg-gradient-to-r ${getColorClasses(world.color)} p-6 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{world.icon}</span>
                {!world.isLocked ? (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">AVAILABLE</span>
                ) : (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">🔒 LOCKED</span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{world.title}</h3>
              <p className="text-sm text-white/90 mb-3">{world.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span>{world.lessonsCount} lessons</span>
                <span>{world.estimatedTime}</span>
              </div>
            </div>

            {/* Action Section */}
            <div className="p-4 space-y-2">
              {!world.isLocked ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchLessons(world.id);
                    }}
                    className={`w-full btn text-white bg-gradient-to-r ${getColorClasses(world.color)} hover:opacity-90`}
                  >
                    View Lessons
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProgressionWorldId(world.id);
                      setProgressionModalOpen(true);
                    }}
                    className="w-full btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    🏔️ View Mountain Progress
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Complete previous worlds to unlock
                  </p>
                  <button
                    disabled
                    className="w-full btn btn-outline opacity-50 cursor-not-allowed"
                  >
                    Locked
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lessons Modal/Section */}
      {selectedWorld && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {worlds.find(w => w.id === selectedWorld)?.title} Lessons
                </h2>
                <p className="text-gray-600">
                  {worlds.find(w => w.id === selectedWorld)?.description}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedWorld(null);
                  setLessons([]);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Lessons Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {lessonsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading lessons...</p>
                </div>
              ) : lessons.length > 0 ? (
                <div className="space-y-4">
                  {lessons.map((lesson, index) => {
                    const difficultyInfo = getDifficultyLabel(lesson.difficulty);
                    return (
                      <Link
                        key={lesson.id}
                        to={`/lesson/${lesson.id}`}
                        className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-lg font-bold text-gray-400">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {lesson.title}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${difficultyInfo.color}`}>
                                {difficultyInfo.label}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{lesson.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>⏱️ {lesson.estimatedTime}</span>
                              <span>⭐ {lesson.xpReward} XP</span>
                              <span>💎 {lesson.coinReward} coins</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            {lesson.isCompleted ? (
                              <span className="text-green-600 text-xl">✅</span>
                            ) : (
                              <span className="text-gray-300 text-xl">⭕</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No lessons available for this world yet.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {lessons.length} lessons • Total rewards: {lessons.reduce((sum, l) => sum + l.xpReward, 0)} XP
                </div>
                <button
                  onClick={() => {
                    setSelectedWorld(null);
                    setLessons([]);
                  }}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mountain Progression Modal */}
      {progressionModalOpen && progressionWorldId && (
        <MountainProgression
          worldId={progressionWorldId}
          worldTitle={worlds.find(w => w.id === progressionWorldId)?.title || ''}
          worldColor={worlds.find(w => w.id === progressionWorldId)?.color || 'gray'}
          isOpen={progressionModalOpen}
          onClose={() => {
            setProgressionModalOpen(false);
            setProgressionWorldId(null);
          }}
        />
      )}
    </div>
  );
};

export default WorldsPage; 