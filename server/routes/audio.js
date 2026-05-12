const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');

// Configure multer to save files in 'uploads/' directory with extensions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

router.post('/upload', auth, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({ error: 'Groq API Key is required for this feature' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const filePath = req.file.path;

    // Transcribe audio using Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-large-v3',
      response_format: 'json',
      temperature: 0.0,
    });

    // Delete the temporary file
    fs.unlinkSync(filePath);

    res.json({ transcript: transcription.text });
  } catch (error) {
    console.error('Audio Upload Error:', error);
    // Try to delete file if it exists and wasn't deleted
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: `Failed to transcribe audio: ${error.message}` });
  }
});

module.exports = router;
