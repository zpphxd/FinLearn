import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { MountainProgression } from '../components/MountainProgression';
import { VocabularyAnimator } from '../components/VocabularyAnimator';

interface LessonSection {
  type: 'concept' | 'question' | 'scenario' | 'practice' | 'story' | 'interactive_demo' | 'game' | 'achievement' | 'calculator' | 'action_plan' | 'strategy' | 'tools' | 'insight' | 'challenge' | 'myth_busting' | 'real_world' | 'time_value' | 'interactive_gauge';
  title: string;
  content?: string;
  visual?: string;
  character?: string;
  analogy?: string;
  mascotReaction?: string;
  wisdom?: string;
  tips?: string;
  mantra?: string;
  legend?: string;
  examples?: string[];
  question?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  scenario?: string;
  interactive?: boolean;
  questions?: Array<{ label: string; answer: number; type?: string; placeholder?: string }>;
  items?: Array<{ name?: string; category?: string; emoji?: string; expense?: string; answer?: string; tool?: string; pros?: string; cons?: string; best_for?: string; choice?: string; result?: string; outcome?: string; situation?: string; credit_role?: string; myth?: string; truth?: string; maya_says?: string }>;
  calculator?: any;
  stages?: string;
  patterns?: string[];
  steps?: string[];
  commitment?: string;
  grades?: Array<{ range: string; grade: string; description: string }>;
  myths?: Array<{ myth: string; truth: string; maya_says: string }>;
  scenarios?: Array<{ situation: string; credit_role: string }>;
  comparison?: Array<{ climber: string; starts_age: number; monthly: number; stops_age: number; total_invested: number; value_at_65: number }>;
  moral?: string;
  insight?: string;
  actionable?: boolean;
  reward?: string;
  days?: Array<{ day: string; categories: string[] }>;
  methods?: string;
  calculatorOptions?: Array<{ strategy?: string; year_5?: string; year_10?: string; year_20?: string; year_30?: string; tool?: string; pros?: string; cons?: string; best_for?: string }>;
}

interface LessonContent {
  type: string;
  sections: LessonSection[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  xpReward: number;
  coinReward: number;
  estimatedTime: string;
  content: LessonContent;
}

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [showMountainProgress, setShowMountainProgress] = useState(false);
  const [completionData, setCompletionData] = useState<any>(null);
  const [discoveredVocab, setDiscoveredVocab] = useState<Array<{ term: string; definition: string; category: string; fromLesson: string }>>([]);

  // Get world ID from lesson ID (assumes format like "budgeting_1", "credit_2", etc.)
  const getWorldIdFromLesson = (lessonId: string): string => {
    if (lessonId.startsWith('budgeting_')) return 'budgeting';
    if (lessonId.startsWith('credit_')) return 'credit';
    if (lessonId.startsWith('investing_')) return 'investing';
    if (lessonId.startsWith('taxes_')) return 'taxes';
    if (lessonId.startsWith('insurance_')) return 'insurance';
    if (lessonId.startsWith('realestate_')) return 'realestate';
    if (lessonId.startsWith('retirement_')) return 'retirement';
    if (lessonId.startsWith('independence_')) return 'independence';
    return 'budgeting'; // fallback
  };

  const getWorldTitle = (worldId: string): string => {
    const worldTitles: { [key: string]: string } = {
      budgeting: 'Budget Base Camp',
      credit: 'Credit Cliff Climbing',
      investing: 'Investment Peak Ascent',
      taxes: 'Tax Trail Navigation',
      insurance: 'Insurance Safety Ridge',
      realestate: 'Real Estate Summit',
      retirement: 'Retirement Mountain Peak',
      independence: 'Financial Freedom Summit'
    };
    return worldTitles[worldId] || 'Budget Base Camp';
  };

  const getWorldColor = (worldId: string): string => {
    const worldColors: { [key: string]: string } = {
      budgeting: 'emerald',
      credit: 'blue',
      investing: 'purple',
      taxes: 'orange',
      insurance: 'red',
      realestate: 'teal',
      retirement: 'indigo',
      independence: 'yellow'
    };
    return worldColors[worldId] || 'emerald';
  };

  const handleVocabWordAdded = (word: { term: string; definition: string; category: string; fromLesson: string }) => {
    setDiscoveredVocab(prev => {
      // Check if word already exists
      if (prev.some(w => w.term === word.term)) {
        return prev;
      }
      return [...prev, word];
    });
  };

  // Helper function to wrap text content with VocabularyAnimator
  const wrapWithVocabAnimator = (content: string) => {
    if (!content || typeof content !== 'string') return content;
    
    return (
      <VocabularyAnimator 
        lessonTitle={lesson?.title || ''} 
        onVocabWordAdded={handleVocabWordAdded}
      >
        {content}
      </VocabularyAnimator>
    );
  };

  // Sound effects
  const playSound = (type: 'correct' | 'complete' | 'levelup') => {
    const audio = new Audio();
    switch (type) {
      case 'correct':
        // Create a pleasant "ding" sound
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmctBieCyvLSgTMLElyx6eOZTwwKUaTZ8bZiFgtAktP';
        break;
      case 'complete':
        // Create a success fanfare sound
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmctBieCyvLSgTMLElyx6eOZTwwKUaTZ8bZiFgtAktP';
        break;
      case 'levelup':
        // Create an achievement sound
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmctBieCyvLSgTMLElyx6eOZTwwKUaTZ8bZiFgtAktP';
        break;
    }
    audio.play().catch(() => {
      // Fallback: use Web Audio API to create sounds
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      if (type === 'correct') {
        oscillator.frequency.setValueAtTime(800, context.currentTime);
        oscillator.frequency.setValueAtTime(1000, context.currentTime + 0.1);
      } else if (type === 'complete') {
        oscillator.frequency.setValueAtTime(523, context.currentTime);
        oscillator.frequency.setValueAtTime(659, context.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, context.currentTime + 0.2);
      } else if (type === 'levelup') {
        oscillator.frequency.setValueAtTime(440, context.currentTime);
        oscillator.frequency.setValueAtTime(554, context.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(659, context.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(880, context.currentTime + 0.3);
      }
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    });
  };

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await apiClient.get(`/lessons/${lessonId}`);
        setLesson(response.data.data);
      } catch (error) {
        console.error('Failed to fetch lesson:', error);
        navigate('/app/worlds');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId, navigate]);

  const handleAnswerSelect = (answerIndex: number) => {
    const section = lesson?.content.sections[currentSection];
    if (section?.type === 'question' && section.correctAnswer !== undefined) {
      setSelectedAnswer(answerIndex);
      const correct = answerIndex === section.correctAnswer;
      setIsCorrect(correct);
      setShowExplanation(true);
      
      if (correct) {
        playSound('correct');
      }
    }
  };

  const handlePracticeAnswer = (questionLabel: string, value: string) => {
    setPracticeAnswers(prev => ({
      ...prev,
      [questionLabel]: value
    }));
  };

  const checkPracticeAnswers = () => {
    const section = lesson?.content.sections[currentSection];
    if (section?.type === 'practice' && section.questions) {
      const allCorrect = section.questions.every(q => 
        parseInt(practiceAnswers[q.label] || '0') === q.answer
      );
      return allCorrect;
    }
    return false;
  };

  const handleNext = () => {
    if (!lesson) return;

    if (currentSection < lesson.content.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(false);
      setPracticeAnswers({});
    } else {
      completeLesson();
    }
  };

  const completeLesson = async () => {
    if (!lesson || isCompleting) return;
    
    setIsCompleting(true);
    try {
      const response = await apiClient.post(`/lessons/${lesson.id}/complete`);
      const completionData = response.data.data;
      
      // Update user data
      if (user) {
        updateUser({
          ...user,
          xp: completionData.newXP,
          coins: completionData.newCoins,
          level: completionData.newLevel
        });
      }
      
      // Play appropriate sound
      if (completionData.leveledUp) {
        playSound('levelup');
      } else {
        playSound('complete');
      }
      
      // Store completion data and show mountain progress
      setCompletionData(completionData);
      setShowMountainProgress(true);
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const canProceed = () => {
    const section = lesson?.content.sections[currentSection];
    if (!section) return false;
    
    switch (section.type) {
      case 'concept':
        return true;
      case 'question':
        return showExplanation && isCorrect;
      case 'scenario':
        return showExplanation && isCorrect;
      case 'practice':
        return checkPracticeAnswers();
      default:
        return true;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lesson not found</p>
          <button 
            onClick={() => navigate('/app/worlds')}
            className="mt-4 btn btn-primary"
          >
            Back to Worlds
          </button>
        </div>
      </div>
    );
  }

  const section = lesson.content.sections[currentSection];
  const progress = ((currentSection + 1) / lesson.content.sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/app/worlds')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <span className="mr-2">←</span>
              Back
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">{lesson.title}</h1>
              <p className="text-sm text-gray-600">{lesson.estimatedTime}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>💎 {lesson.coinReward}</span>
              <span>⭐ {lesson.xpReward} XP</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          {/* Section Content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
            
            {section.type === 'story' && (
              <div className="space-y-6">
                <div className="text-center text-4xl mb-4">{section.visual}</div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-blue-400">
                  <div className="text-lg text-gray-800 leading-relaxed mb-4">
                    {wrapWithVocabAnimator(section.content || '')}
                  </div>
                  {section.character && (
                    <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                      <div className="text-sm text-gray-700 italic">
                        {wrapWithVocabAnimator(section.character)}
                      </div>
                    </div>
                  )}
                  {section.wisdom && (
                    <div className="mt-3 bg-yellow-50 p-3 rounded-lg border-l-2 border-yellow-400">
                      <div className="text-sm text-yellow-800">
                        💡 {wrapWithVocabAnimator(section.wisdom)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {section.type === 'concept' && (
              <div className="space-y-6">
                <div className="text-center text-4xl mb-4">{section.visual}</div>
                <div className="text-lg text-gray-700 leading-relaxed">
                  {wrapWithVocabAnimator(section.content || '')}
                </div>
                {section.analogy && (
                  <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-400">
                    <div className="text-emerald-800">
                      🧗‍♀️ {wrapWithVocabAnimator(section.analogy)}
                    </div>
                  </div>
                )}
                {section.examples && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                    <ul className="space-y-1">
                      {section.examples.map((example, idx) => (
                        <li key={idx} className="text-gray-700">
                          {wrapWithVocabAnimator(example)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {section.tips && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-blue-800 text-sm">
                      💡 {wrapWithVocabAnimator(section.tips)}
                    </div>
                  </div>
                )}
                {section.mantra && (
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-purple-800 font-medium italic">
                      "{wrapWithVocabAnimator(section.mantra)}"
                    </div>
                  </div>
                )}
              </div>
            )}

            {section.type === 'game' && (
              <div className="space-y-6">
                <div className="text-center text-4xl mb-4">{section.visual}</div>
                <div className="text-lg text-gray-700 mb-6">
                  {wrapWithVocabAnimator(section.content || '')}
                </div>
                <div className="grid gap-3">
                  {section.items?.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{item.emoji} {item.expense}</span>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                            Fixed 🗿
                          </button>
                          <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200">
                            Variable 🌦️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === 'achievement' && (
              <div className="space-y-6 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-300">
                  <h3 className="text-2xl font-bold text-yellow-800 mb-2">{section.title}</h3>
                  <div className="text-lg text-yellow-700">
                    {wrapWithVocabAnimator(section.content || '')}
                  </div>
                </div>
              </div>
            )}

            {section.type === 'strategy' && (
              <div className="space-y-6">
                <div className="text-center text-4xl mb-4">{section.visual}</div>
                <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-400">
                  <h3 className="text-xl font-bold text-indigo-900 mb-3">{section.title}</h3>
                  <div className="whitespace-pre-line text-indigo-800">
                    {wrapWithVocabAnimator(section.content || '')}
                  </div>
                </div>
              </div>
            )}

            {section.type === 'myth_busting' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-red-600 mb-4">🔥 {section.title}</h3>
                {section.myths?.map((myth, index) => (
                  <div key={index} className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <div className="mb-3">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">MYTH</span>
                      <div className="text-red-700 mt-2">
                        {wrapWithVocabAnimator(myth.myth)}
                      </div>
                    </div>
                    <div className="mb-3">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">TRUTH</span>
                      <div className="text-green-700 mt-2">
                        {wrapWithVocabAnimator(myth.truth)}
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                      <div className="text-gray-700 text-sm italic">
                        🏔️ {wrapWithVocabAnimator(myth.maya_says)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'interactive_demo' && (
              <div className="space-y-6">
                <div className="text-center text-4xl mb-4">{section.visual}</div>
                <div className="text-lg text-gray-700 mb-6">
                  {wrapWithVocabAnimator(section.content || '')}
                </div>
                {section.calculator && (
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold mb-4">💰 Monthly Income: ${section.calculator.income.toLocaleString()}</h4>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">🏠 Needs ({section.calculator.needs.percentage}%)</span>
                          <span className="text-xl font-bold text-emerald-600">${section.calculator.needs.amount}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {section.calculator.needs.examples.join(', ')}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">🎉 Wants ({section.calculator.wants.percentage}%)</span>
                          <span className="text-xl font-bold text-blue-600">${section.calculator.wants.amount}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {section.calculator.wants.examples.join(', ')}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">⛰️ Savings ({section.calculator.savings.percentage}%)</span>
                          <span className="text-xl font-bold text-purple-600">${section.calculator.savings.amount}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {section.calculator.savings.examples.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(section.type === 'question' || section.type === 'scenario') && (
              <div className="space-y-6">
                {section.scenario && (
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="text-blue-800">
                      {wrapWithVocabAnimator(section.scenario)}
                    </div>
                  </div>
                )}
                <div className="text-lg text-gray-700">
                  {wrapWithVocabAnimator(section.question || '')}
                </div>
                <div className="grid gap-3">
                  {section.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      className={`p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? isCorrect
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                      } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <div className="flex-1">
                          {wrapWithVocabAnimator(option)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {showExplanation && section.explanation && (
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border`}>
                    <div className={`${isCorrect ? 'text-green-800' : 'text-blue-800'}`}>
                      {wrapWithVocabAnimator(section.explanation)}
                    </div>
                    {section.mascotReaction && (
                      <div className="mt-3 bg-white bg-opacity-70 p-3 rounded-lg">
                        <div className="text-sm text-gray-700 italic">
                          🏔️ {wrapWithVocabAnimator(section.mascotReaction)}
                        </div>
                      </div>
                    )}
                    {section.visual && (
                      <div className="text-center text-2xl mt-2">{section.visual}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {section.type === 'practice' && (
              <div className="space-y-6">
                <div className="text-lg text-gray-700">
                  {wrapWithVocabAnimator(section.scenario || '')}
                </div>
                <div className="grid gap-4">
                  {section.questions?.map((question, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <label className="text-gray-700 font-medium min-w-[150px]">
                        {question.label}:
                      </label>
                      <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <input
                          type="number"
                          value={practiceAnswers[question.label] || ''}
                          onChange={(e) => handlePracticeAnswer(question.label, e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      {practiceAnswers[question.label] && parseInt(practiceAnswers[question.label]) === question.answer && (
                        <span className="text-green-600">✓</span>
                      )}
                    </div>
                  ))}
                </div>
                
                {checkPracticeAnswers() && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">🎉 Perfect! You've got the hang of this.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-600">
              Section {currentSection + 1} of {lesson.content.sections.length}
            </div>
            
            <button
              onClick={handleNext}
              disabled={!canProceed() || isCompleting}
              className={`btn btn-primary px-8 ${
                !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isCompleting 
                ? 'Completing...' 
                : currentSection === lesson.content.sections.length - 1 
                  ? 'Complete Lesson' 
                  : 'Continue'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Completion Summary Modal */}
      {completionData && !showMountainProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 rounded-2xl max-w-md w-full p-6 text-center border-2 border-emerald-200">
            <div className="text-6xl mb-4">🏔️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Trail Section Completed!</h2>
            <div className="bg-white bg-opacity-80 p-4 rounded-xl mb-4">
              <p className="text-sm text-gray-600 mb-2">Maya cheers: "Great climbing! You've gained valuable summit skills!"</p>
              <div className="space-y-2">
                <div className="text-lg">
                  <span className="text-emerald-600 font-semibold">🏔️ +{completionData.xpGained} Altitude Points</span>
                </div>
                <div className="text-lg">
                  <span className="text-yellow-600 font-semibold">💎 +{completionData.coinsGained} Summit Coins</span>
                </div>
                {completionData.leveledUp && (
                  <div className="text-purple-600 font-semibold text-lg bg-purple-50 p-2 rounded-lg">
                    🎊 Summit Level Up! You're now Level {completionData.newLevel} Climber! 🎊
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setShowMountainProgress(true)}
                className="w-full btn btn-primary"
              >
                🗺️ View Your Mountain Journey
              </button>
              <button
                onClick={() => navigate('/app/worlds')}
                className="w-full btn btn-outline"
              >
                🏕️ Return to Base Camp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mountain Progression Modal */}
      {showMountainProgress && lessonId && completionData && (
        <MountainProgression
          worldId={getWorldIdFromLesson(lessonId)}
          worldTitle={getWorldTitle(getWorldIdFromLesson(lessonId))}
          worldColor={getWorldColor(getWorldIdFromLesson(lessonId))}
          isOpen={showMountainProgress}
          onClose={() => {
            setShowMountainProgress(false);
            setCompletionData(null);
            navigate('/app/worlds');
          }}
        />
      )}
    </div>
  );
};

export default LessonPage; 