const express = require('express');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;

    if (!userId || !quizId || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid submission data' });
    }

    // Fetch quiz to validate answers and calculate score
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswerIndex) score++;
    });

    const submission = new Submission({
      user: userId,
      quiz: quizId,
      answers,
      score,
      totalQuestions: quiz.questions.length,
    });

    await submission.save();

    res.status(201).json({ message: 'Submission saved', score, totalQuestions: quiz.questions.length });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ message: 'Error saving submission' });
  }
});

module.exports = router;
