import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { generatePrescription, generateFullConsultationReport } from '../utils/pdfGenerator';
import { 
  FileText, 
  Search, 
  ArrowLeft, 
  Calendar, 
  User, 
  Pill, 
  Activity, 
  FileDown, 
  Download, 
  Trash2, 
  AlertTriangle,
  ChevronRight,
  Filter
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://voicedoc-backend-wkkr.onrender.com/api";

const ConsultationsHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('All');
  
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAllConsultations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/consultations`);
      setConsultations(res.data);
    } catch (err) {
      console.error("Failed to fetch consultations history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllConsultations();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${API_BASE_URL}/consultations/${deleteTarget._id}`);
      setConsultations(prev => prev.filter(c => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete consultation:", err);
      alert("Failed to delete consultation record.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredConsultations = consultations.filter(c => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      c.patientName?.toLowerCase().includes(query) ||
      c.diagnosis?.toLowerCase().includes(query) ||
      c.symptoms?.some(s => s.toLowerCase().includes(query));

    const matchesGender = filterGender === 'All' || c.patientGender === filterGender;

    return matchesSearch && matchesGender;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-[#9ca3af] hover:text-white mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Master Consultation History
          </h1>
          <p className="text-sm text-[#9ca3af]">All clinical sessions, voice transcripts, and exportable medical reports.</p>
        </div>
        <Link to="/new-consultation" className="vd-btn-gradient px-4 py-2 font-medium flex items-center gap-2 shadow-sm text-sm">
          + New Consultation
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="vd-card p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <input 
            type="text" 
            placeholder="Search by patient name, diagnosis, or symptom..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="vd-input w-full pl-10 pr-4 py-2 text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9ca3af]" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs text-[#9ca3af] font-medium">
            <Filter className="h-3.5 w-3.5" /> Gender:
          </div>
          <select 
            value={filterGender}
            onChange={e => setFilterGender(e.target.value)}
            className="vd-input px-3 py-1.5 text-xs font-medium"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Consultations List */}
      {loading ? (
        <div className="p-12 text-center text-[#9ca3af]">Loading consultation history...</div>
      ) : filteredConsultations.length === 0 ? (
        <div className="vd-card p-12 text-center text-[#9ca3af] flex flex-col items-center">
          <FileText className="h-12 w-12 text-[#4b5563] mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No consultations found</h3>
          <p className="text-sm max-w-md">No clinical records match your current search or filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map(consult => (
            <div 
              key={consult._id}
              className="vd-card p-6 hover:bg-[#1f2937]/40 transition-all duration-200 border border-[#1f2937] hover:border-[#374151] space-y-4"
            >
              {/* Row Top Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1f2937] pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-base">
                    {consult.patientName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 
                      onClick={() => navigate(`/patient/${encodeURIComponent(consult.patientName)}`)}
                      className="font-bold text-white text-base hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                    >
                      {consult.patientName}
                      <ChevronRight className="h-4 w-4 text-[#9ca3af]" />
                    </h3>
                    <p className="text-xs text-[#9ca3af]">
                      {consult.patientAge} yrs • {consult.patientGender} • Visited on {new Date(consult.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => generatePrescription(consult, user)}
                    className="px-3 py-1.5 rounded-lg bg-[#1f2937] hover:bg-[#374151] text-secondary border border-[#374151] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Download Rx Prescription"
                  >
                    <FileDown className="h-3.5 w-3.5 text-secondary" /> Download Rx
                  </button>

                  <button
                    onClick={() => generateFullConsultationReport(consult, user)}
                    className="vd-btn-gradient px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    title="Export Full Clinical Report PDF"
                  >
                    <Download className="h-3.5 w-3.5" /> Export Full Report PDF
                  </button>

                  <button
                    onClick={() => setDeleteTarget(consult)}
                    className="p-1.5 hover:bg-red-500/20 text-[#9ca3af] hover:text-red-400 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Row Clinical Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-1">Diagnosis</span>
                  <p className="font-semibold text-white">{consult.diagnosis || 'Pending Assessment'}</p>
                  {consult.symptoms?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {consult.symptoms.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[11px] font-medium border border-red-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-1">Prescribed Medicines ({consult.medicines?.length || 0})</span>
                  {consult.medicines?.length > 0 ? (
                    <div className="space-y-1">
                      {consult.medicines.slice(0, 2).map((m, idx) => (
                        <div key={idx} className="text-xs text-gray-300 flex justify-between bg-[#111827] px-2 py-1 rounded">
                          <span className="font-medium text-white">{m.name}</span>
                          <span className="text-[#9ca3af]">{m.dosage}</span>
                        </div>
                      ))}
                      {consult.medicines.length > 2 && (
                        <span className="text-[11px] text-primary font-medium">+ {consult.medicines.length - 2} more</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[#9ca3af] italic">None prescribed</p>
                  )}
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider block mb-1">Encounter Vitals & Advice</span>
                  <div className="text-xs text-gray-300 space-y-1">
                    {consult.vitals && (
                      <p className="text-secondary font-medium">
                        BP: {consult.vitals.bloodPressure || 'N/A'} • HR: {consult.vitals.heartRate || 'N/A'} bpm
                      </p>
                    )}
                    {consult.advice && (
                      <p className="text-[#9ca3af] line-clamp-2 italic">"{consult.advice}"</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-red-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Consultation</h3>
            </div>
            
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              Are you sure you want to delete the consultation record for <strong className="text-white">{deleteTarget.patientName}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-[#1f2937] hover:bg-[#374151] text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsHistory;
