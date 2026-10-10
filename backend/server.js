const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env if present
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes & error middleware
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());

// HTTP request logger (skip during automated test runs)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root info endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Campus Equipment Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users'
    }
  });
});

// Health check endpoint
app.get(['/health', '/api/health'], (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus
  });
});

// Mount application routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

// Database connection helper
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college_management_system';
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

const PORT = process.env.PORT || 5000;

// Start server if executed directly
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] Campus Equipment Management System API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  });
}

module.exports = app;
