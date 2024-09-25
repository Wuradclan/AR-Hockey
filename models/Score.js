// models/Score.js
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Score', scoreSchema);
