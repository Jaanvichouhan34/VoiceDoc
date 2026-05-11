const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  duration: String
}, { _id: false });

const consultationSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, required: true },
  symptoms: [String],
  diagnosis: String,
  medicines: [medicineSchema],
  advice: String,
  followUpDate: String,
  transcript: String,
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
