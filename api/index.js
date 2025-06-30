// Vercel serverless function wrapper for Express app
// Since we can't require TypeScript directly in Vercel, we'll create a JS version
const express = require('express');
const cors = require('cors');

// Create the app with basic setup for Vercel deployment
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://finlearn-app.vercel.app']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy', timestamp: new Date().toISOString() });
});

// Basic API routes for production
app.get('/api/worlds', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'budgeting',
        name: 'Budgeting Basecamp',
        description: 'Master the fundamentals of budgeting',
        difficulty: 1,
        icon: '💰',
        isUnlocked: true,
        lessonsCount: 6,
        xpReward: 300
      },
      {
        id: 'credit',
        name: 'Credit Peak',
        description: 'Build and maintain excellent credit',
        difficulty: 2,
        icon: '📊',
        isUnlocked: true,
        lessonsCount: 4,
        xpReward: 200
      },
      {
        id: 'investing',
        name: 'Investment Summit',
        description: 'Grow your wealth through smart investing',
        difficulty: 3,
        icon: '📈',
        isUnlocked: false,
        lessonsCount: 5,
        xpReward: 400
      }
    ]
  });
});

// For development, just return success for other endpoints
app.use('/api/*', (req, res) => {
  res.json({ success: true, message: 'API endpoint available' });
});

module.exports = app; 