// Vercel serverless function entry point
import '../backend/src/simple-index';
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../backend/src/simple-index';

// Export the Express app for Vercel
export default app;

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
}; 