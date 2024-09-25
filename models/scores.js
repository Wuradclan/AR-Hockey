// routes/scores.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Score = require('./Score.js');
const User = require('./User.js');
const router = express.Router();

// Middleware to authenticate user
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Submit Score
router.post('/submit', auth, async (req, res) => {
  const { score } = req.body;

  try {
    const newScore = new Score({
      user: req.user.id,
      score,
    });

    await newScore.save();
    res.json(newScore);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10).populate('user', 'username');
    res.json(scores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
