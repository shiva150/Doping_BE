const express = require('express');
const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all quizzes (title + description + user submission status)
router.get('/', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'title description');

    // Fetch submissions for the current user
    const submissions = await Submission.find({ user: req.user.id });

    // Create a map of quiz IDs to submission objects for quick lookup
    const submissionMap = new Map();
    submissions.forEach(sub => submissionMap.set(sub.quiz.toString(), sub));

    // Combine quiz data with submission status
    const quizzesWithStatus = quizzes.map(quiz => {
      const submission = submissionMap.get(quiz._id.toString());
      return {
        ...quiz.toJSON(),
        isCompleted: !!submission,
        score: submission ? submission.score : null,
        totalQuestions: submission ? submission.totalQuestions : null,
      };
    });

    res.json(quizzesWithStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
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

module.exports = router; 

