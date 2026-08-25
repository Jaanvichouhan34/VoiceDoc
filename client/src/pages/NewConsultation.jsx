import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generatePrescription } from '../utils/pdfGenerator';
import { startRecognition, stopRecognition } from '../utils/speech';
import { Mic, MicOff, BrainCircuit, FileDown, Save, CheckCircle2, AlertCircle, X, Plus, Upload, Sparkles, ShieldCheck, RotateCcw, ThumbsUp, ThumbsDown, MessageSquare, UserCheck, Stethoscope, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatSpeakerDialogue, toSpeakerTaggedText } from '../utils/diarization';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://voicedoc-backend-wkkr.onrender.com/api";

const NewConsultation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState({ patientName: '', patientAge: '', patientGender: 'Male' });
  const [language, setLanguage] = useState('hi-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [viewMode, setViewMode] = useState('dialogue'); // 'dialogue' | 'raw'

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);
  const [structuredData, setStructuredData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(null);

  const [suggesting, setSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFeedback = async (rating) => {
    try {
      setFeedbackGiven(rating);
      await axios.post(`${API_BASE_URL}/feedback`, { rating });
    } catch (err) {
      console.error("Failed to submit AI feedback:", err);
    }
  };

  const autoTagTranscript = () => {
    if (!transcript.trim()) return;
    const formatted = toSpeakerTaggedText(transcript);
    setTranscript(formatted);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecognition();
      setIsRecording(false);
    } else {
      startRecognition((text) => setTranscript(text), language);
      setIsRecording(true);
    }
  };

  const handleAudioUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/audio/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setTranscript(res.data.transcript);
      alert('Audio transcribed successfully!');
    } catch (err) {
      console.error("Audio Upload Error:", err);
      alert(`Failed to transcribe audio: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const analyzeTranscript = async () => {
    if (!transcript.trim()) return;
    setAnalyzing(true);
    setAnalysisError(false);
    setIsVerified(false);
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/analyze`, { transcript });
      setStructuredData(res.data);
      if (res.data.symptoms && res.data.symptoms.length > 0) {
        getAiSuggestions(res.data.symptoms);
      }
    } catch (err) {
      console.error("AI Analysis Technical Error:", err);
      setAnalysisError(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const getAiSuggestions = async (symptoms) => {
    setSuggesting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/suggest`, { symptoms });
      setAiSuggestions(res.data);
    } catch (err) {
      console.error('Failed to get suggestions:', err.response?.data?.error || err.message);
    } finally {
      setSuggesting(false);
    }
  };

  const handleSave = async (generatePdf = false) => {
    if (!patientData.patientName || !structuredData) return alert('Missing required patient data');
    if (!isVerified) return alert('Please review the AI diagnosis & prescription and check the verification box before confirming.');

    setSaving(true);
    try {
      const payload = {
        ...patientData,
        ...structuredData,
        transcript
      };
      await axios.post(`${API_BASE_URL}/consultations`, payload);

      if (generatePdf) {
        generatePrescription({ ...patientData, ...structuredData }, user);
      }

      alert('Prescription confirmed and record saved successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to save record. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">New Consultation</h1>

      {/* Patient Form */}
      <div className="vd-card p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Patient Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Patient Name"
            value={patientData.patientName}
            onChange={e => setPatientData({ ...patientData, patientName: e.target.value })}
            className="vd-input w-full px-4 py-2"
          />
          <input
            type="number"
            placeholder="Age"
            value={patientData.patientAge}
            onChange={e => setPatientData({ ...patientData, patientAge: e.target.value })}
            className="vd-input w-full px-4 py-2"
          />
          <select
            value={patientData.patientGender}
            onChange={e => setPatientData({ ...patientData, patientGender: e.target.value })}
            className="vd-input w-full px-4 py-2"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Recording & Transcript */}
        <div className="flex flex-col gap-6">
          <div className="vd-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Voice Input</h2>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="vd-input px-3 py-1 text-sm font-medium"
                disabled={isRecording}
              >
                <option value="hi-IN">Hindi (hi-IN)</option>
                <option value="en-US">English (en-US)</option>
              </select>
            </div>

            <div className="flex justify-center mb-6 relative">
              {isRecording && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                    className="absolute w-20 h-20 bg-red-500 rounded-full"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="absolute w-20 h-20 bg-red-500 rounded-full"
                  />
                </>
              )}
              <button
                onClick={toggleRecording}
                className={`relative z-10 p-6 rounded-full shadow-lg transition-all ${isRecording ? 'bg-red-500' : 'bg-[#1f2937] hover:bg-[#374151]'}`}
              >
                {isRecording ? <MicOff className="h-10 w-10 text-white" /> : <Mic className="h-10 w-10 text-white" />}
              </button>
            </div>
            <p className="text-center text-sm font-medium text-[#9ca3af] mb-4">
              {isRecording ? 'Listening... click to stop' : 'Click to start recording'}
            </p>

            <div className="flex justify-center mb-4">
              <label className="cursor-pointer bg-[#1f2937] hover:bg-[#374151] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {uploading ? 'Transcribing...' : 'Upload Audio File'}
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={(e) => handleAudioUpload(e.target.files[0])}
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1 bg-[#1f2937] p-1 rounded-lg border border-[#374151]">
                <button
                  type="button"
                  onClick={() => setViewMode('dialogue')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'dialogue' ? 'bg-primary text-white shadow-sm' : 'text-[#9ca3af] hover:text-white'}`}
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Speaker Dialogue
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('raw')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'raw' ? 'bg-primary text-white shadow-sm' : 'text-[#9ca3af] hover:text-white'}`}
                >
                  Raw Text
                </button>
              </div>

              <button
                type="button"
                onClick={autoTagTranscript}
                disabled={!transcript}
                className="px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-40"
                title="Automatically format Doctor & Patient turns"
              >
                <Sparkles className="h-3.5 w-3.5" /> Auto-Tag Speakers
              </button>
            </div>

            {viewMode === 'dialogue' && transcript.trim() ? (
              <div className="space-y-3 max-h-64 overflow-y-auto p-3 bg-[#0a0f1e] rounded-xl border border-[#1f2937]">
                {formatSpeakerDialogue(transcript).map((turn, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                      turn.speaker === 'Doctor'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-100 ml-2'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100 mr-2'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px]">
                      <span className={`flex items-center gap-1 ${turn.speaker === 'Doctor' ? 'text-primary' : 'text-emerald-400'}`}>
                        {turn.speaker === 'Doctor' ? <Stethoscope className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                        {turn.speaker}
                      </span>
                      <span className="text-[#9ca3af] text-[10px]">Turn #{idx + 1}</span>
                    </div>
                    <p className="font-sans text-xs">{turn.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <textarea 
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder="Live transcript will appear here or click a sample transcript above..."
                className="vd-input w-full h-48 p-4 font-mono text-secondary resize-none"
              />
            )}

            <button 
              onClick={analyzeTranscript}
              disabled={analyzing || !transcript}
              className="mt-4 w-full flex justify-center items-center gap-2 py-3 px-4 vd-btn-gradient disabled:opacity-50"
            >
              {analyzing ? <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span> : <BrainCircuit className="h-5 w-5" />}
              {analyzing ? 'Analyzing with AI...' : 'Analyze with AI'}
            </button>

            {analysisError && (
              <div className="mt-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>Analysis failed, please retry</span>
                </div>
                <button
                  onClick={analyzeTranscript}
                  disabled={analyzing}
                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Retry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Structured Output & Actions */}
        <div className="flex flex-col gap-6">
          <div className="vd-card p-6 min-h-[400px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#1f2937] pb-4 mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Structured Record
              </h2>
              {structuredData && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-400" />
                  AI-generated, please verify
                </span>
              )}
            </div>

            {analysisError ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-red-500/20 rounded-xl bg-red-500/5 my-6">
                <AlertCircle className="h-12 w-12 text-red-400 mb-3" />
                <h3 className="text-white font-bold text-base mb-1">Analysis failed, please retry</h3>
                <p className="text-xs text-[#9ca3af] max-w-xs mb-4">The AI service encountered a temporary error or timeout. Your transcript is safe.</p>
                <button
                  onClick={analyzeTranscript}
                  disabled={analyzing}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg font-bold text-xs flex items-center gap-2 border border-red-500/30 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" /> Retry Analysis
                </button>
              </div>
            ) : !structuredData ? (
              <div className="h-full flex flex-col items-center justify-center text-[#374151] py-12">
                <BrainCircuit className="h-16 w-16 mb-4 opacity-50" />
                <p>Analyze transcript to generate structured record</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* AI Extraction Rating Widget */}
                <div className="flex items-center justify-between p-3.5 bg-[#111827] rounded-xl border border-[#1f2937]">
                  <span className="text-xs text-[#9ca3af] font-medium flex items-center gap-1.5">
                    Was this AI extraction accurate?
                  </span>
                  {feedbackGiven ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Rating recorded!
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleFeedback('up')}
                        className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Accurate Extraction"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" /> Accurate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFeedback('down')}
                        className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Needs Improvement"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" /> Inaccurate
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-l-[3px] border-red-500 pl-4">
                  <h3 className="text-sm font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Symptoms</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {structuredData.symptoms?.map((sym, i) => (
                      <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm font-medium border border-red-500/20 flex items-center gap-1">
                        {sym}
                        <button
                          onClick={() => {
                            const newSyms = [...structuredData.symptoms];
                            newSyms.splice(i, 1);
                            setStructuredData({ ...structuredData, symptoms: newSyms });
                          }}
                          className="hover:text-red-500 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add symptom and press Enter..."
                      className="vd-input py-1.5 px-3 text-sm w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          setStructuredData({
                            ...structuredData,
                            symptoms: [...(structuredData.symptoms || []), e.target.value]
                          });
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="border-l-[3px] border-blue-500 pl-4">
                  <h3 className="text-sm font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Vitals</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <label className="text-xs text-[#9ca3af]">BP</label>
                      <input
                        type="text"
                        value={structuredData.vitals?.bloodPressure || ''}
                        onChange={(e) => setStructuredData({
                          ...structuredData,
                          vitals: { ...(structuredData.vitals || {}), bloodPressure: e.target.value }
                        })}
                        className="vd-input py-1.5 px-3 text-sm w-full"
                        placeholder="120/80"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#9ca3af]">Heart Rate</label>
                      <input
                        type="number"
                        value={structuredData.vitals?.heartRate || ''}
                        onChange={(e) => setStructuredData({
                          ...structuredData,
                          vitals: { ...(structuredData.vitals || {}), heartRate: e.target.value }
                        })}
                        className="vd-input py-1.5 px-3 text-sm w-full"
                        placeholder="72"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#9ca3af]">Temp (°F)</label>
                      <input
                        type="number"
                        value={structuredData.vitals?.temperature || ''}
                        onChange={(e) => setStructuredData({
                          ...structuredData,
                          vitals: { ...(structuredData.vitals || {}), temperature: e.target.value }
                        })}
                        className="vd-input py-1.5 px-3 text-sm w-full"
                        placeholder="98.6"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#9ca3af]">Weight (kg)</label>
                      <input
                        type="number"
                        value={structuredData.vitals?.weight || ''}
                        onChange={(e) => setStructuredData({
                          ...structuredData,
                          vitals: { ...(structuredData.vitals || {}), weight: e.target.value }
                        })}
                        className="vd-input py-1.5 px-3 text-sm w-full"
                        placeholder="70"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-l-[3px] border-primary pl-4">
                  <h3 className="text-sm font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Diagnosis</h3>
                  <input
                    type="text"
                    value={structuredData.diagnosis}
                    onChange={(e) => setStructuredData({ ...structuredData, diagnosis: e.target.value })}
                    className="vd-input w-full py-2.5 px-3 text-white font-medium"
                    placeholder="Enter diagnosis..."
                  />
                </div>

                <div className="border-l-[3px] border-yellow-500 pl-4">
                  <h3 className="text-sm font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Medicines</h3>
                  <div className="border border-[#1f2937] rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#1f2937] text-sm">
                      <thead className="bg-[#1f2937]">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-[#9ca3af]">Name</th>
                          <th className="px-4 py-2 text-left font-medium text-[#9ca3af]">Dosage</th>
                          <th className="px-4 py-2 text-left font-medium text-[#9ca3af]">Duration</th>
                          <th className="px-4 py-2 text-left font-medium text-[#9ca3af]"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1f2937] bg-[#111827]">
                        {structuredData.medicines?.map((med, i) => (
                          <tr key={i} className="even:bg-[#1f2937]/50">
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={med.name}
                                onChange={(e) => {
                                  const newMeds = [...structuredData.medicines];
                                  newMeds[i].name = e.target.value;
                                  setStructuredData({ ...structuredData, medicines: newMeds });
                                }}
                                className="bg-transparent border-0 focus:ring-0 text-white font-medium w-full p-0"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={med.dosage}
                                onChange={(e) => {
                                  const newMeds = [...structuredData.medicines];
                                  newMeds[i].dosage = e.target.value;
                                  setStructuredData({ ...structuredData, medicines: newMeds });
                                }}
                                className="bg-transparent border-0 focus:ring-0 text-[#9ca3af] w-full p-0"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={med.duration}
                                onChange={(e) => {
                                  const newMeds = [...structuredData.medicines];
                                  newMeds[i].duration = e.target.value;
                                  setStructuredData({ ...structuredData, medicines: newMeds });
                                }}
                                className="bg-transparent border-0 focus:ring-0 text-[#9ca3af] w-full p-0"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                onClick={() => {
                                  const newMeds = [...structuredData.medicines];
                                  newMeds.splice(i, 1);
                                  setStructuredData({ ...structuredData, medicines: newMeds });
                                }}
                                className="text-[#9ca3af] hover:text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-[#1f2937]/20">
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              placeholder="New medicine..."
                              className="bg-transparent border-0 focus:ring-0 text-white w-full p-0 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value) {
                                  setStructuredData({
                                    ...structuredData,
                                    medicines: [...(structuredData.medicines || []), { name: e.target.value, dosage: '', duration: '' }]
                                  });
                                  e.target.value = '';
                                }
                              }}
                            />
                          </td>
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2"></td>
                          <td className="px-4 py-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-l-[3px] border-success pl-4">
                  <h3 className="text-sm font-bold text-[#9ca3af] uppercase tracking-wider mb-2">Advice</h3>
                  <textarea
                    value={structuredData.advice}
                    onChange={(e) => setStructuredData({ ...structuredData, advice: e.target.value })}
                    className="vd-input w-full py-2.5 px-3 text-[#f9fafb] text-sm resize-none"
                    rows="3"
                    placeholder="Enter advice..."
                  />
                </div>

                {structuredData.followUpDate && (
                  <div className="border-l-[3px] border-purple-500 pl-4">
                    <h3 className="text-sm font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Follow-up</h3>
                    <input
                      type="text"
                      value={structuredData.followUpDate}
                      onChange={(e) => setStructuredData({ ...structuredData, followUpDate: e.target.value })}
                      className="vd-input w-full py-1.5 px-3 text-white font-medium text-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Suggestions */}
          {structuredData && (
            <div className="vd-card p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-purple-500" />
                AI Suggestions
              </h2>
              {suggesting ? (
                <div className="text-center py-4 text-[#9ca3af]">Loading AI suggestions...</div>
              ) : aiSuggestions && aiSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {aiSuggestions.map((sug, i) => (
                    <div key={i} className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <h4 className="font-bold text-purple-400">{sug.name}</h4>
                      <p className="text-sm text-purple-200 mt-1">{sug.reasoning}</p>
                    </div>
                  ))}
                  <div className="flex items-start gap-2 text-xs text-[#9ca3af] mt-4 bg-[#1f2937] p-3 rounded-lg border border-[#374151]">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>Disclaimer: This is AI assistance only, not a replacement for clinical judgment.</p>
                  </div>
                </div>
              ) : (
                <p className="text-[#9ca3af] text-sm italic">No suggestions available.</p>
              )}
            </div>
          )}

          {/* Doctor Verification Checkbox & Actions */}
          {structuredData && (
            <div className="space-y-4">
              <div className="vd-card p-4 border border-primary/30 bg-[#111827] flex items-start gap-3">
                <input
                  type="checkbox"
                  id="verifyCheckbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary cursor-pointer shrink-0"
                />
                <label htmlFor="verifyCheckbox" className="text-sm font-medium text-gray-200 cursor-pointer select-none leading-relaxed">
                  I have reviewed and verified the AI-generated diagnosis, medicines, and dosage instructions for clinical accuracy.
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving || !isVerified}
                  className="flex-1 flex justify-center items-center gap-2 py-3.5 px-4 bg-success text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  {saving ? 'Saving...' : 'Confirm & Save Record'}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving || !isVerified}
                  className="flex-1 flex justify-center items-center gap-2 py-3.5 px-4 vd-btn-gradient text-white rounded-xl font-bold hover:opacity-95 transition-opacity shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FileDown className="h-5 w-5" />
                  Confirm & Generate PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewConsultation;
