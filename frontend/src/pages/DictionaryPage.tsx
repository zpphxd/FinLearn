import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon, SearchIcon } from 'lucide-react';

interface VocabTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  fromLesson: string;
  difficulty: number;
}

const vocabularyData: VocabTerm[] = [
  {
    id: 'budget_def',
    term: 'Budget',
    definition: 'A plan for how to spend and save money over a specific period, typically monthly',
    category: 'Budgeting',
    fromLesson: 'What is a Budget?',
    difficulty: 1
  },
  {
    id: 'income_def',
    term: 'Income',
    definition: 'Money received, especially on a regular basis, from work or investments',
    category: 'Budgeting',
    fromLesson: 'Income vs Expenses',
    difficulty: 1
  },
  {
    id: 'expenses_def',
    term: 'Expenses',
    definition: 'Money spent on goods and services to maintain your lifestyle',
    category: 'Budgeting',
    fromLesson: 'Income vs Expenses',
    difficulty: 1
  },
  {
    id: 'needs_def',
    term: 'Needs',
    definition: 'Essential expenses required for basic living (housing, food, utilities)',
    category: 'Budgeting',
    fromLesson: 'The 50/30/20 Rule',
    difficulty: 1
  },
  {
    id: 'wants_def',
    term: 'Wants',
    definition: 'Non-essential expenses that improve quality of life but aren\'t required',
    category: 'Budgeting',
    fromLesson: 'The 50/30/20 Rule',
    difficulty: 1
  },
  {
    id: 'savings_def',
    term: 'Savings',
    definition: 'Money set aside for future use, emergencies, or long-term goals',
    category: 'Budgeting',
    fromLesson: 'The 50/30/20 Rule',
    difficulty: 1
  },
  {
    id: 'credit_def',
    term: 'Credit',
    definition: 'The ability to borrow money with the promise to pay it back later',
    category: 'Credit',
    fromLesson: 'What is Credit?',
    difficulty: 1
  },
  {
    id: 'credit_score_def',
    term: 'Credit Score',
    definition: 'A numerical rating (300-850) that represents your creditworthiness',
    category: 'Credit',
    fromLesson: 'What is Credit?',
    difficulty: 2
  }
];

export const DictionaryPage: React.FC = () => {
  const { user: _user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredTerms, setFilteredTerms] = useState<VocabTerm[]>(vocabularyData);

  const categories = ['All', ...Array.from(new Set(vocabularyData.map(term => term.category)))];

  useEffect(() => {
    let filtered = vocabularyData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(term => term.category === selectedCategory);
    }

    setFilteredTerms(filtered);
  }, [searchTerm, selectedCategory]);

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BookOpenIcon className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Financial Dictionary</h1>
        </div>
        <p className="text-gray-600">
          Your personal collection of financial terms and concepts learned throughout your journey.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-primary-600">{vocabularyData.length}</div>
          <div className="text-sm text-gray-600">Terms Learned</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">{categories.length - 1}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round((vocabularyData.filter(t => t.difficulty <= 2).length / vocabularyData.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Mastery Progress</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search terms or definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map((term) => (
          <div key={term.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{term.term}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(term.difficulty)}`}>
                {getDifficultyLabel(term.difficulty)}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 leading-relaxed">
              {term.definition}
            </p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                {term.category}
              </span>
              <span className="text-gray-500">
                From: {term.fromLesson}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No terms found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria, or complete more lessons to learn new terms!
          </p>
        </div>
      )}
    </div>
  );
}; 