const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, specialization, registrationNumber } = req.body;
    
    let doctor = await Doctor.findOne({ email });
    if (doctor) return res.status(400).json({ error: 'Doctor already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    doctor = new Doctor({
      name, email, password: hashedPassword, specialization, registrationNumber
    });

    await doctor.save();

    const payload = { id: doctor.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.json({ token, doctor: { 
      id: doctor.id, 
      name: doctor.name, 
      email: doctor.email,
      specialization: doctor.specialization,
      registrationNumber: doctor.registrationNumber
    } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const payload = { id: doctor.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.json({ token, doctor: { 
      id: doctor.id, 
      name: doctor.name, 
      email: doctor.email,
      specialization: doctor.specialization,
      registrationNumber: doctor.registrationNumber
    } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
