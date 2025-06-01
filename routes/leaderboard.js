const express = require('express');
const GameState = require('../models/GameState');
const Submission = require('../models/Submission');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/leaderboard
// @desc    Get the leaderboard based on combined Fair Points and Quiz Points
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('Starting leaderboard fetch...');

    // First, get all game states
    let gameStates;
    try {
      console.log('Fetching game states...');
      gameStates = await GameState.find()
        .populate({
          path: 'user',
          select: 'username',
          options: { lean: true }
        });
      console.log(`Found ${gameStates.length} game states`);
    } catch (err) {
      console.error('Error fetching game states:', err);
      throw new Error('Failed to fetch game states');
    }

    // Filter out any game states with missing user data
    const validGameStates = gameStates.filter(state => state.user && state.user.username);
    console.log(`Found ${validGameStates.length} valid game states with user data`);

    // Get all quiz submissions and calculate total quiz points per user
    let quizScores;
    try {
      console.log('Fetching quiz scores...');
      quizScores = await Submission.aggregate([
        {
          $group: {
            _id: '$user',
            totalQuizPoints: { $sum: '$score' }
          }
        }
      ]);
      console.log(`Found ${quizScores.length} quiz score entries`);
    } catch (err) {
      console.error('Error fetching quiz scores:', err);
      throw new Error('Failed to fetch quiz scores');
    }

    // Create a map of user IDs to their quiz points
    const quizPointsMap = new Map(
      quizScores.map(score => [score._id.toString(), score.totalQuizPoints])
    );

    // Combine Fair Points and Quiz Points for each user
    console.log('Combining scores...');
    const combinedScores = validGameStates.map(gameState => {
      try {
        const userId = gameState.user._id.toString();
        const quizPoints = quizPointsMap.get(userId) || 0;
        const convertedQuizPoints = quizPoints * 100; // Convert quiz points to Fair Points
        const totalPoints = (gameState.fairPoints || 0) + convertedQuizPoints;

        return {
          userId: gameState.user._id,
          username: gameState.user.username,
          fairPoints: gameState.fairPoints || 0,
          quizPoints: quizPoints,
          convertedQuizPoints: convertedQuizPoints,
          totalPoints: totalPoints
        };
      } catch (err) {
        console.error('Error processing game state:', gameState, err);
        return null;
      }
    }).filter(Boolean); // Remove any null entries from errors

    console.log('Combined scores:', combinedScores.length);

    // Sort by total points and add rank
    const sortedScores = combinedScores
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 10) // Get top 10
      .map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId,
        username: entry.username,
        points: entry.totalPoints,
        fairPoints: entry.fairPoints,
        quizPoints: entry.quizPoints,
        convertedQuizPoints: entry.convertedQuizPoints
      }));

    console.log('Final sorted scores:', sortedScores.length);
    
    // If no scores, return empty array instead of error
    if (sortedScores.length === 0) {
      console.log('No scores found, returning empty array');
      return res.status(200).json([]);
    }

    res.status(200).json(sortedScores);
  } catch (err) {
    console.error('❌ Leaderboard error:', err);
    // Send more detailed error information
    res.status(500).json({ 
      message: 'Server error',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;
