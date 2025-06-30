# 🏔️ FinLearn - Financial Summits

A gamified financial literacy platform that uses mountain climbing metaphors to teach essential money management skills. Built with React, TypeScript, and Node.js.

## 🌟 Features

### 🏔️ Mountain-Themed Learning Journey
- **3 Financial Summits**: Budgeting, Credit & Debt, and Investing
- **Progressive difficulty** with locked/unlocked content
- **Visual progression** with mountain climbing metaphors

### 💰 Interactive Budget Simulator
- **3-month first apartment challenge** with 13 real-world scenarios
- **Real-time budget tracking** across 6 categories
- **Stress level monitoring** (Financial, Social, Health, Career)
- **Monthly income cycles** ($4,500/month)
- **Consequence-based learning** with scoring system

### 🎯 Gamification Elements
- **XP points** for completing lessons
- **Achievement badges** for milestones
- **Mountain progression** visualization
- **Vocabulary mastery** system with animations

### 🔐 User System
- **JWT-based authentication**
- **Progress tracking** across all summits
- **Personalized dashboard**
- **Lesson completion history**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zpphxd/FinLearn.git
   cd FinLearn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API server on `http://localhost:5001`
   - Frontend development server on `http://localhost:3000`

### Demo Account
- **Email**: `demo@finlearn.com`
- **Password**: `demo123`

## 📁 Project Structure

```
FinLearn/
├── backend/
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── models/           # Data models
│   │   ├── middleware/       # Auth & error handling
│   │   └── simple-index.ts   # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
│   └── package.json
├── shared/
│   └── src/
│       └── types/           # Shared TypeScript types
└── package.json             # Root package with scripts
```

## 🎮 Key Components

### Interactive Budget Simulator
The flagship feature - a comprehensive 3-month apartment budgeting challenge:

- **13 Progressive Scenarios**: From security deposits to subscription traps
- **Budget Categories**: Housing, Transportation, Food, Entertainment, Emergency Fund, Miscellaneous
- **Real-time Tracking**: Budget remaining, category spending, stress levels
- **Educational Outcomes**: 120+ possible points, meaningful financial lessons

### Mountain Progression System
Visual representation of learning progress:
- **Base Camp** → **Summit** progression
- **Locked/unlocked** content based on completion
- **XP accumulation** from lessons and activities

### Vocabulary Animation System
Interactive financial term learning with:
- **Smooth animations** for term presentation
- **Progress tracking** for vocabulary mastery
- **Contextual integration** within lessons

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **JWT** for authentication
- **In-memory storage** (easily extensible to database)

### Development
- **Concurrently** for running multiple servers
- **Nodemon** for backend hot reload
- **ESLint** for code quality

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Content
- `GET /api/worlds` - Get all financial summits
- `GET /api/worlds/:worldId/lessons` - Get lessons for a summit
- `GET /api/lessons/:lessonId` - Get specific lesson
- `POST /api/lessons/:lessonId/complete` - Mark lesson complete

### Progress
- `GET /api/worlds/:worldId/progression` - Get user progress

## 🎯 Educational Goals

### Budgeting Summit
- Emergency fund importance
- Category-based budgeting
- Expense tracking
- Fixed vs. variable costs

### Credit & Debt Summit
- Credit score fundamentals
- Debt management strategies
- Interest rate impacts
- Responsible borrowing

### Investing Summit
- Investment basics
- Risk vs. reward
- Compound interest
- Diversification principles

## 🔧 Configuration

### Environment Variables
Create `.env` files in backend and frontend directories:

**Backend (.env)**
```
PORT=5001
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5001
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Social features (leaderboards, sharing)
- [ ] Mobile app development
- [ ] Additional financial summits (Taxes, Insurance, Real Estate)
- [ ] Advanced analytics and reporting
- [ ] Multilingual support
- [ ] Integration with real financial APIs

## 🏆 Credits

Created with ❤️ for financial literacy education. Mountain climbing metaphors chosen to represent the journey of financial growth and the achievement of reaching financial goals.

---

**Start your financial summit today!** 🏔️💰 