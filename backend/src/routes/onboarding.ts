import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get onboarding assessment questions
router.get('/assessment', asyncHandler(async (req: express.Request, res: express.Response) => {
  const assessment = {
    personalityQuestions: [
      {
        id: 'p1',
        question: 'When it comes to money, I tend to:',
        type: 'multiple-choice',
        options: [
          'Save every penny I can',
          'Spend on things I enjoy',
          'Invest for the future',
          'Worry about financial decisions'
        ],
        category: 'personality',
        weight: 1
      },
      {
        id: 'p2',
        question: 'My ideal financial goal is:',
        type: 'multiple-choice',
        options: [
          'Having a large emergency fund',
          'Being able to buy what I want',
          'Building wealth over time',
          'Financial security and stability'
        ],
        category: 'personality',
        weight: 1
      }
    ],
    knowledgeQuestions: [
      {
        id: 'k1',
        question: 'What is compound interest?',
        type: 'multiple-choice',
        options: [
          'Interest earned on both principal and previously earned interest',
          'A type of bank account',
          'A fee charged by banks',
          'I\'m not sure'
        ],
        category: 'knowledge',
        weight: 1
      }
    ]
  };
  
  res.json({
    success: true,
    data: assessment
  });
}));

// Submit onboarding assessment
router.post('/assessment', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { personalityAnswers, knowledgeAnswers } = req.body;
  
  // Simple algorithm to determine personality type and knowledge level
  const personalityType = 'saver'; // Simplified
  const knowledgeLevel = 'beginner'; // Simplified
  
  const result = {
    personalityType,
    knowledgeLevel,
    suggestedPath: 'budgeting',
    strengths: ['Saving mindset'],
    areasToImprove: ['Investment knowledge', 'Credit understanding']
  };
  
  res.json({
    success: true,
    data: result
  });
}));

export default router; 