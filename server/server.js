import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Route Placeholders
import wingmanRoutes from './routes/wingman.js';
import professionalsRoutes from './routes/professionals.js';
import bookingsRoutes from './routes/bookings.js';
import searchRoutes from './routes/search.js';
import authRoutes from './routes/auth.js';

app.use('/api/wingman', wingmanRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 CareBridge backend server running on port ${PORT}`);
});
