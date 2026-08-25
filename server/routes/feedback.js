const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

// Submit feedback (thumbs up or down)
router.post('/', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    if (!['up', 'down'].includes(rating)) {
      return res.status(400).json({ error: "Invalid rating value. Must be 'up' or 'down'." });
    }

    const feedback = new Feedback({ rating });
    await feedback.save();

    res.status(201).json({ message: 'Feedback saved successfully', rating });
  } catch (err) {
    console.error('Feedback Save Error:', err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Get feedback accuracy statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const positive = await Feedback.countDocuments({ rating: 'up' });
    const negative = await Feedback.countDocuments({ rating: 'down' });

    const percentage = total > 0 ? parseFloat(((positive / total) * 100).toFixed(1)) : 100.0;

    res.json({
      total,
      positive,
      negative,
      percentage
    });
  } catch (err) {
    console.error('Feedback Stats Error:', err);
    res.status(500).json({ error: 'Failed to fetch feedback stats' });
  }
});

module.exports = router;
