export const productionConfig = {
  port: process.env.PORT || 5001,
  cors: {
    origin: [
      'https://finlearn.vercel.app',
      'https://finlearn-*.vercel.app',
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    credentials: true
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'production_jwt_secret_should_be_set_in_env',
    expiresIn: '7d'
  },
  database: {
    // For production, you'd connect to a real database
    // url: process.env.DATABASE_URL
  }
}; 