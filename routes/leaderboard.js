const express = require('express');
const Submission = require('../models/Submission');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          quizzesTaken: { $sum: 1 },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
    ]);

    // Populate user info (username)
    const populated = await User.populate(leaderboard, {
      path: '_id',
      select: 'username',
    });

    const result = populated.map((entry, index) => ({
      rank: index + 1,
      userId: entry._id._id,
      username: entry._id.username,
      totalScore: entry.totalScore,
      quizzesTaken: entry.quizzesTaken,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Leaderboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
