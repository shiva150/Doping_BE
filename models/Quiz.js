const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswerIndex: Number
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [questionSchema],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' } // optional if you have modules
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
