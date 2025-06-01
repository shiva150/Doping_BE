const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true }, // Hashed password
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  score: { type: Number, default: 0 },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
