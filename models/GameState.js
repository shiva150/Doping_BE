const mongoose = require('mongoose');

const GameStateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Each user has only one game state
  },
  fairPoints: {
    type: Number,
    default: 0
  },
  testAgents: [
    {
      id: { type: Number, required: true },
      count: { type: Number, default: 0 }
    }
  ],
  equipment: [
    {
      id: { type: Number, required: true },
      count: { type: Number, default: 0 }
    }
  ],
});

module.exports = mongoose.model('GameState', GameStateSchema); 