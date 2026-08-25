const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  rating: {
    type: String,
    enum: ['up', 'down'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
