const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 

dotenv.config();

connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const quizRoutes = require('./routes/quiz');
const submissionRoutes = require('./routes/submission');
const authRoutes = require('./routes/auth');
const leaderboardRouter = require('./routes/leaderboard');
const gameRoutes = require('./routes/game');

app.use('/api/quizzes', quizRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/game', gameRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



