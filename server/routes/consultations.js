const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const auth = require('../middleware/auth');

// Get all consultations for logged-in doctor
router.get('/', auth, async (req, res) => {
  try {
    const consultations = await Consultation.find({ doctor: req.user.id }).sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Search patients by name
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const consultations = await Consultation.find({ 
      doctor: req.user.id,
      patientName: { $regex: q, $options: 'i' }
    }).sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Save new consultation
router.post('/', auth, async (req, res) => {
  try {
    const newConsultation = new Consultation({
      ...req.body,
      doctor: req.user.id
    });
    const consultation = await newConsultation.save();
    res.json(consultation);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get trends for a specific patient
router.get('/patient/:name', auth, async (req, res) => {
  try {
    const consultations = await Consultation.find({ 
      doctor: req.user.id,
      patientName: req.params.name
    }).sort({ createdAt: 1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a single consultation by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findOneAndDelete({
      _id: req.params.id,
      doctor: req.user.id
    });
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });
    res.json({ message: 'Consultation deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete all consultations for a specific patient
router.delete('/patient/:name', auth, async (req, res) => {
  try {
    const result = await Consultation.deleteMany({
      doctor: req.user.id,
      patientName: req.params.name
    });
    res.json({ message: 'Patient records deleted successfully', count: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
