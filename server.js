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



app.use('/api/quizzes', quizRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



