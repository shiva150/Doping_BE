
const express = require('express');
const Quiz = require('../models/Quiz');

const router = express.Router(); 

// GET all quizzes (title + description)
router.get('/', async (req, res) => {
  const quizzes = await Quiz.find({}, 'title description');
  res.json(quizzes);
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; // 

