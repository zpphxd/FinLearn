import React, { useState, useEffect, useRef } from 'react';
import { BookOpenIcon, SparklesIcon } from 'lucide-react';

interface VocabularyWord {
  term: string;
  definition: string;
  category: string;
  fromLesson: string;
}

interface VocabularyAnimatorProps {
  children: string;
  lessonTitle: string;
  onVocabWordAdded?: (word: VocabularyWord) => void;
}

// Dictionary of financial terms that should be highlighted
const VOCABULARY_TERMS: { [key: string]: Omit<VocabularyWord, 'fromLesson'> } = {
  budget: {
    term: 'Budget',
    definition: 'A plan for how to spend and save money over a specific period, typically monthly',
    category: 'Budgeting'
  },
  income: {
    term: 'Income',
    definition: 'Money received, especially on a regular basis, from work or investments',
    category: 'Budgeting'
  },
  expenses: {
    term: 'Expenses',
    definition: 'Money spent on goods and services to maintain your lifestyle',
    category: 'Budgeting'
  },
  needs: {
    term: 'Needs',
    definition: 'Essential expenses required for basic living (housing, food, utilities)',
    category: 'Budgeting'
  },
  wants: {
    term: 'Wants',
    definition: 'Non-essential expenses that improve quality of life but aren\'t required',
    category: 'Budgeting'
  },
  savings: {
    term: 'Savings',
    definition: 'Money set aside for future use, emergencies, or long-term goals',
    category: 'Budgeting'
  },
  credit: {
    term: 'Credit',
    definition: 'The ability to borrow money with the promise to pay it back later',
    category: 'Credit'
  },
  'credit score': {
    term: 'Credit Score',
    definition: 'A numerical rating (300-850) that represents your creditworthiness',
    category: 'Credit'
  },
  emergency: {
    term: 'Emergency Fund',
    definition: 'Money saved specifically for unexpected expenses or financial emergencies',
    category: 'Budgeting'
  },
  investment: {
    term: 'Investment',
    definition: 'Money put into financial schemes, shares, property, or commercial ventures with the expectation of achieving a profit',
    category: 'Investing'
  },
  compound: {
    term: 'Compound Interest',
    definition: 'Interest calculated on the initial principal and the accumulated interest from previous periods',
    category: 'Investing'
  },
  debt: {
    term: 'Debt',
    definition: 'Money owed to another person or organization',
    category: 'Credit'
  },
  interest: {
    term: 'Interest',
    definition: 'Money paid regularly at a particular rate for the use of money lent',
    category: 'Credit'
  }
};

export const VocabularyAnimator: React.FC<VocabularyAnimatorProps> = ({ 
  children, 
  lessonTitle, 
  onVocabWordAdded 
}) => {
  const [animatingWords, setAnimatingWords] = useState<Set<string>>(new Set());
  const [discoveredWords, setDiscoveredWords] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  const highlightVocabularyWords = (text: string): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    let lastIndex = 0;
    
    // Sort terms by length (longest first) to avoid partial matches
    const sortedTerms = Object.keys(VOCABULARY_TERMS).sort((a, b) => b.length - a.length);
    
    // Find all vocabulary words in the text
    const foundTerms: Array<{ term: string; startIndex: number; endIndex: number }> = [];
    
    for (const term of sortedTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      let match: RegExpExecArray | null;
      
      while ((match = regex.exec(text)) !== null) {
        // Check if this position is already covered by a longer term
        const isOverlapping = foundTerms.some(
          existing => 
            (match!.index >= existing.startIndex && match!.index < existing.endIndex) ||
            (match!.index + match![0].length > existing.startIndex && match!.index + match![0].length <= existing.endIndex)
        );
        
        if (!isOverlapping) {
          foundTerms.push({
            term: match[0].toLowerCase(),
            startIndex: match.index,
            endIndex: match.index + match[0].length
          });
        }
      }
    }
    
    // Sort by position in text
    foundTerms.sort((a, b) => a.startIndex - b.startIndex);
    
    // Build the JSX with highlighted terms
    for (let i = 0; i < foundTerms.length; i++) {
      const { term, startIndex, endIndex } = foundTerms[i];
      
      // Add text before this term
      if (startIndex > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, startIndex)}
          </span>
        );
      }
      
      // Add the highlighted term
      const actualTerm = text.substring(startIndex, endIndex);
      const isNewWord = !discoveredWords.has(term);
      
      elements.push(
        <VocabularyWord
          key={`vocab-${startIndex}`}
          term={actualTerm}
          termKey={term}
          isNew={isNewWord}
          definition={VOCABULARY_TERMS[term]}
          lessonTitle={lessonTitle}
          onDiscovered={() => handleWordDiscovered(term)}
          onVocabWordAdded={onVocabWordAdded}
        />
      );
      
      lastIndex = endIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-end`}>
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return elements;
  };

  const handleWordDiscovered = (term: string) => {
    if (!discoveredWords.has(term)) {
      setDiscoveredWords(prev => new Set(prev).add(term));
      setAnimatingWords(prev => new Set(prev).add(term));
      
      // Remove from animating after animation completes
      setTimeout(() => {
        setAnimatingWords(prev => {
          const newSet = new Set(prev);
          newSet.delete(term);
          return newSet;
        });
      }, 2000);
    }
  };

  return (
    <div ref={contentRef} className="relative">
      <div className="vocab-content">
        {highlightVocabularyWords(children)}
      </div>
      
      {/* Dictionary Animation Overlay */}
      {animatingWords.size > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-bounce">
            <BookOpenIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Added to Dictionary!</span>
            <SparklesIcon className="h-4 w-4 animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
};

interface VocabularyWordProps {
  term: string;
  termKey: string;
  isNew: boolean;
  definition: Omit<VocabularyWord, 'fromLesson'>;
  lessonTitle: string;
  onDiscovered: () => void;
  onVocabWordAdded?: (word: VocabularyWord) => void;
}

const VocabularyWord: React.FC<VocabularyWordProps> = ({
  term,
  termKey,
  isNew,
  definition,
  lessonTitle,
  onDiscovered,
  onVocabWordAdded
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  
  const handleClick = () => {
    // Only trigger animation and discovery for new words
    if (isNew && !hasBeenClicked) {
      setHasBeenClicked(true);
      onDiscovered();
      
      // Add to user's dictionary
      if (onVocabWordAdded) {
        onVocabWordAdded({
          ...definition,
          fromLesson: lessonTitle
        });
      }
      
      // Trigger flying animation
      triggerFlyingAnimation();
    }
    // For discovered words (isNew = false), clicking does nothing
    // They remain highlighted for hover tooltips only
  };
  
  const triggerFlyingAnimation = () => {
    // Create a flying copy of the word
    const flyingElement = document.createElement('div');
    flyingElement.textContent = term;
    flyingElement.className = 'fixed z-50 font-bold text-blue-600 pointer-events-none transition-all duration-2000 ease-out';
    flyingElement.style.left = '50%';
    flyingElement.style.top = '50%';
    flyingElement.style.transform = 'translate(-50%, -50%)';
    flyingElement.style.fontSize = '1.2rem';
    
    document.body.appendChild(flyingElement);
    
    // Animate to dictionary icon position (top right)
    setTimeout(() => {
      flyingElement.style.left = '90%';
      flyingElement.style.top = '5%';
      flyingElement.style.transform = 'translate(-50%, -50%) scale(0.5)';
      flyingElement.style.opacity = '0';
    }, 100);
    
    // Remove element after animation
    setTimeout(() => {
      document.body.removeChild(flyingElement);
    }, 2100);
  };

  return (
    <span className="relative inline-block">
      <span
        className={`
          relative transition-all duration-200
          ${isNew 
            ? 'font-bold text-blue-600 bg-blue-50 px-1 rounded border-b-2 border-blue-300 hover:bg-blue-100 hover:border-blue-500 cursor-pointer' 
            : 'font-semibold text-purple-600 hover:text-purple-800 cursor-help'
          }
          ${hasBeenClicked ? 'animate-pulse' : ''}
        `}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {term}
        {isNew && (
          <SparklesIcon className="inline h-3 w-3 text-blue-400 ml-1 animate-bounce" />
        )}
      </span>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl">
          <div className="font-semibold text-blue-300 mb-1">{definition.term}</div>
          <div className="text-gray-200 mb-2">{definition.definition}</div>
          <div className="text-xs text-gray-400">Category: {definition.category}</div>
          {isNew && (
            <div className="text-xs text-blue-300 mt-1 font-medium">Click to add to dictionary!</div>
          )}
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </span>
  );
}; 