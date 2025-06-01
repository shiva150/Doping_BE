const express = require('express');
const router = express.Router();
const GameState = require('../models/GameState');
// Assuming you have an auth middleware like this
const auth = require('../middleware/auth'); // Adjust the path as necessary

// @route   GET /api/game
// @desc    Get user's game state
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let gameState = await GameState.findOne({ user: req.user.id });

    if (!gameState) {
      // Create a new game state if one doesn't exist
      gameState = new GameState({
        user: req.user.id,
        fairPoints: 0,
        testAgents: [],
        equipment: []
      });
      await gameState.save();
    }

    res.json(gameState);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/game/save
// @desc    Save user's game state
// @access  Private
router.post('/save', auth, async (req, res) => {
  const { fairPoints, testAgents, equipment } = req.body;

  // Build game state object
  const gameFields = {};
  gameFields.user = req.user.id;
  if (fairPoints !== undefined) gameFields.fairPoints = fairPoints;
  if (testAgents) gameFields.testAgents = testAgents;
  if (equipment) gameFields.equipment = equipment;

  try {
    let gameState = await GameState.findOne({ user: req.user.id });

    if (gameState) {
      // Update existing game state
      gameState = await GameState.findOneAndUpdate(
        { user: req.user.id },
        { $set: gameFields },
        { new: true }
      );
      return res.json(gameState);
    } else {
       // This case should ideally not happen if GET is called first, but handle it just in case
       res.status(404).json({ msg: 'Game state not found for this user' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 