const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const destinasiRoutes = require('./routes/destinasi');
const bookingRoutes = require('./routes/booking');

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinasi', destinasiRoutes);
app.use('/api/booking', bookingRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Tourism API'
  });
});

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    success: false,
    message: error.message || 'Server Error'
  });
});

module.exports = app;
