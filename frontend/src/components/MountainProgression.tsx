import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

interface MountainStage {
  stage: number;
  name: string;
  xpRequired: number;
  emoji: string;
  description: string;
}

interface ProgressionData {
  worldId: string;
  currentXP: number;
  currentStage: MountainStage;
  nextStage: MountainStage | null;
  progressToNext: number;
  totalStages: number;
  allStages: MountainStage[];
  completedLessons: number;
  totalLessons: number;
}

interface MountainProgressionProps {
  worldId: string;
  worldTitle: string;
  worldColor: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MountainProgression: React.FC<MountainProgressionProps> = ({
  worldId,
  worldTitle,
  worldColor,
  isOpen,
  onClose
}) => {
  const [progressionData, setProgressionData] = useState<ProgressionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const fetchProgressionData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/worlds/${worldId}/progression`);
      setProgressionData(response.data.data);
    } catch (error) {
      console.error('Error fetching progression data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProgressionData();
    }
  }, [isOpen, worldId]);

  if (!isOpen) return null;

  const getTrailPathPoints = (allStages: MountainStage[]) => {
    const baseY = 400; // Bottom of mountain
    const peakY = 80;  // Top of mountain
    const baseX = 50;  // Left edge
    const peakX = 350; // Right edge
    
    const points = [];
    
    allStages.forEach((stage, index) => {
      const progress = index / (allStages.length - 1);
      
      // Create a zigzag pattern that follows the mountain slope
      const baseProgressX = baseX + (peakX - baseX) * progress;
      const baseProgressY = baseY - (baseY - peakY) * progress;
      
      // Add zigzag offset
      const zigzagOffset = index % 2 === 0 ? -20 : 20;
      const x = baseProgressX + zigzagOffset;
      const y = baseProgressY + Math.sin(progress * Math.PI * 2) * 10;
      
      points.push({ x, y, stage, index });
    });
    
    return points;
  };

  const getPathProgress = (currentXP: number, allStages: MountainStage[], points: any[]) => {
    if (!allStages || allStages.length === 0) return 0;
    
    // Find current stage index
    let currentStageIndex = 0;
    for (let i = allStages.length - 1; i >= 0; i--) {
      if (currentXP >= allStages[i].xpRequired) {
        currentStageIndex = i;
        break;
      }
    }
    
    // Calculate progress within current stage
    const currentStage = allStages[currentStageIndex];
    const nextStage = allStages[currentStageIndex + 1];
    
    if (!nextStage) return 100; // Completed all stages
    
    const progressInStage = Math.max(0, currentXP - currentStage.xpRequired) / 
                           Math.max(1, nextStage.xpRequired - currentStage.xpRequired);
    
    return ((currentStageIndex + progressInStage) / (allStages.length - 1)) * 100;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!progressionData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500">Failed to load mountain progression data</p>
          </div>
        </div>
      </div>
    );
  }

  const trailPoints = getTrailPathPoints(progressionData.allStages);
  const pathProgress = getPathProgress(progressionData.currentXP, progressionData.allStages, trailPoints);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              🏔️ {worldTitle} Mountain
            </h2>
            <p className="text-gray-600 mt-1">
              Your climbing journey • {progressionData.currentXP} XP earned
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{progressionData.currentXP}</div>
            <div className="text-sm text-blue-600">XP Earned</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{progressionData.completedLessons}</div>
            <div className="text-sm text-green-600">Lessons Complete</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{progressionData.currentStage.stage}</div>
            <div className="text-sm text-purple-600">Current Stage</div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(pathProgress)}%</div>
            <div className="text-sm text-orange-600">Mountain Climbed</div>
          </div>
        </div>

        {/* Mountain Visualization */}
        <div className="relative bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 rounded-2xl p-8 overflow-hidden">
          <svg
            viewBox="0 0 400 450"
            className="w-full h-[500px]"
            style={{ maxHeight: '500px' }}
          >
            {/* Sky Background */}
            <defs>
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="50%" stopColor="#98D8E8" />
                <stop offset="100%" stopColor="#B8E6B8" />
              </linearGradient>
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E5E7EB" />
                <stop offset="30%" stopColor="#9CA3AF" />
                <stop offset="60%" stopColor="#6B7280" />
                <stop offset="100%" stopColor="#374151" />
              </linearGradient>
              <linearGradient id="pathCompleted" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="pathIncomplete" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D1D5DB" />
                <stop offset="100%" stopColor="#9CA3AF" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="400" height="450" fill="url(#skyGradient)" />

            {/* Clouds */}
            <circle cx="80" cy="60" r="15" fill="white" opacity="0.8" />
            <circle cx="95" cy="55" r="18" fill="white" opacity="0.8" />
            <circle cx="110" cy="60" r="12" fill="white" opacity="0.8" />
            
            <circle cx="280" cy="40" r="12" fill="white" opacity="0.6" />
            <circle cx="295" cy="35" r="15" fill="white" opacity="0.6" />
            <circle cx="310" cy="40" r="10" fill="white" opacity="0.6" />

            {/* Mountain Shape */}
            <path
              d="M 0 450 L 50 400 L 120 250 L 180 180 L 250 120 L 320 150 L 370 200 L 400 250 L 400 450 Z"
              fill="url(#mountainGradient)"
              stroke="none"
            />
            
            {/* Snow Cap */}
            <path
              d="M 150 200 L 180 180 L 250 120 L 290 140 L 250 160 L 200 190 Z"
              fill="white"
              opacity="0.9"
            />

            {/* Mountain Details */}
            <path
              d="M 100 350 L 130 300 L 160 320 L 180 280 L 200 300 L 220 260"
              stroke="#6B7280"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />

            {/* Trail Path */}
            {trailPoints.map((point, index) => {
              const nextPoint = trailPoints[index + 1];
              if (!nextPoint) return null;
              
              const segmentProgress = (pathProgress / 100) * (trailPoints.length - 1);
              const isCompleted = index < segmentProgress;
              const isPartial = index <= segmentProgress && segmentProgress < index + 1;
              
              const pathLength = Math.sqrt(
                Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
              );
              
              let strokeDasharray = "none";
              let strokeColor = isCompleted ? "#10B981" : "#D1D5DB";
              
              if (isPartial) {
                const partialProgress = segmentProgress - index;
                const visibleLength = pathLength * partialProgress;
                strokeDasharray = `${visibleLength} ${pathLength - visibleLength}`;
                strokeColor = "#10B981";
              }
              
              return (
                <line
                  key={`path-${index}`}
                  x1={point.x}
                  y1={point.y}
                  x2={nextPoint.x}
                  y2={nextPoint.y}
                  stroke={strokeColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Stage Markers */}
            {trailPoints.map((point, index) => {
              const stage = point.stage;
              const isCompleted = progressionData.currentXP >= stage.xpRequired;
              const isCurrent = progressionData.currentStage.stage === stage.stage;
              
              return (
                <g key={`stage-${stage.stage}`}>
                  {/* Stage Circle */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="20"
                    fill={isCompleted ? "#10B981" : isCurrent ? "#F59E0B" : "#E5E7EB"}
                    stroke={isCurrent ? "#F59E0B" : "#6B7280"}
                    strokeWidth="3"
                    className="transition-all duration-300 cursor-pointer hover:scale-110"
                    onClick={() => setSelectedStage(selectedStage === stage.stage ? null : stage.stage)}
                  />
                  
                  {/* Stage Emoji */}
                  <text
                    x={point.x}
                    y={point.y + 2}
                    textAnchor="middle"
                    fontSize="14"
                    className="pointer-events-none select-none"
                  >
                    {stage.emoji}
                  </text>
                  
                  {/* Stage Label */}
                  <text
                    x={point.x}
                    y={point.y - 35}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#374151"
                    className="pointer-events-none select-none"
                  >
                    {stage.name}
                  </text>
                  
                  {/* XP Requirement */}
                  <text
                    x={point.x}
                    y={point.y + 45}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6B7280"
                    className="pointer-events-none select-none"
                  >
                    {stage.xpRequired} XP
                  </text>
                  
                  {/* Current Position Indicator */}
                  {isCurrent && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="28"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}

            {/* Climber Position */}
            {(() => {
              const currentProgress = (pathProgress / 100) * (trailPoints.length - 1);
              const currentIndex = Math.floor(currentProgress);
              const nextIndex = Math.min(currentIndex + 1, trailPoints.length - 1);
              
              if (currentIndex >= trailPoints.length - 1) {
                // At the peak
                const peakPoint = trailPoints[trailPoints.length - 1];
                return (
                  <text
                    x={peakPoint.x}
                    y={peakPoint.y - 50}
                    textAnchor="middle"
                    fontSize="24"
                    className="animate-bounce"
                  >
                    🧗‍♂️
                  </text>
                );
              }
              
              const currentPoint = trailPoints[currentIndex];
              const nextPoint = trailPoints[nextIndex];
              const t = currentProgress - currentIndex;
              
              const climberX = currentPoint.x + (nextPoint.x - currentPoint.x) * t;
              const climberY = currentPoint.y + (nextPoint.y - currentPoint.y) * t;
              
              return (
                <text
                  x={climberX}
                  y={climberY - 15}
                  textAnchor="middle"
                  fontSize="20"
                  className="transition-all duration-500"
                >
                  🧗‍♂️
                </text>
              );
            })()}
          </svg>
        </div>

        {/* Stage Details */}
        {selectedStage !== null && (
          <div className="mt-6 bg-gray-50 rounded-xl p-6">
            {(() => {
              const stage = progressionData.allStages.find(s => s.stage === selectedStage);
              if (!stage) return null;
              
              const isCompleted = progressionData.currentXP >= stage.xpRequired;
              const isCurrent = progressionData.currentStage.stage === stage.stage;
              
              return (
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{stage.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{stage.name}</h3>
                      {isCompleted && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Completed
                        </span>
                      )}
                      {isCurrent && (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{stage.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Requires {stage.xpRequired} XP</span>
                      {progressionData.currentXP >= stage.xpRequired && (
                        <span className="text-green-600">✓ Unlocked</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Next Goal */}
        {progressionData.nextStage && (
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              🎯 Next Goal: {progressionData.nextStage.name}
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">
                {progressionData.nextStage.xpRequired - progressionData.currentXP} more XP needed
              </span>
              <span className="text-sm text-gray-500">
                {progressionData.progressToNext}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressionData.progressToNext}%` }}
              />
            </div>
          </div>
        )}

        {/* Mountain Mastered */}
        {!progressionData.nextStage && (
          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Mountain Mastered!</h3>
            <p className="text-gray-600">
              Congratulations! You've completed your journey through the {worldTitle} mountain.
              Time to explore new peaks!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 