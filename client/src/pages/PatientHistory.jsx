import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, Activity, Pill, User, Trash2, AlertTriangle, FileDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generatePrescription } from '../utils/pdfGenerator';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://voicedoc-backend-wkkr.onrender.com/api";

const PatientHistory = () => {
  const { name } = useParams();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'single'|'all', id?: string }
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/consultations/search?q=${encodeURIComponent(name)}`);
        const exactMatches = res.data.filter(c => c.patientName === name);
        setConsultations(exactMatches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [name]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      if (deleteTarget.type === 'all') {
        await axios.delete(`${API_BASE_URL}/consultations/patient/${encodeURIComponent(name)}`);
        navigate('/dashboard');
      } else if (deleteTarget.type === 'single' && deleteTarget.id) {
        await axios.delete(`${API_BASE_URL}/consultations/${deleteTarget.id}`);
        const updated = consultations.filter(c => c._id !== deleteTarget.id);
        setConsultations(updated);
        if (updated.length === 0) {
          navigate('/dashboard');
        }
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete patient history:", err);
      alert("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#9ca3af]">Loading...</div>;
  if (!consultations.length) return <div className="p-8 text-center text-[#9ca3af]">No records found for {name}.</div>;

  const patient = consultations[0]; 

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-[#9ca3af] hover:text-white mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="vd-card p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#1f2937] p-4 rounded-full text-primary">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{patient.patientName}</h1>
            <p className="text-[#9ca3af]">{patient.patientAge} years old • {patient.patientGender}</p>
          </div>
        </div>

        <button 
          onClick={() => setDeleteTarget({ type: 'all' })}
          className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Delete All Patient Records
        </button>
      </div>

      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="h-5 w-5 text-[#9ca3af]" /> Consultation Timeline
      </h2>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#1f2937] before:to-transparent">
        {consultations.map((consult, index) => (
          <div key={consult._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0f1e] bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <Activity className="h-4 w-4 text-white" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] vd-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-[#1f2937]">
                <span className="font-medium text-secondary text-sm">
                  {new Date(consult.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generatePrescription(consult, user)}
                    className="vd-btn-gradient px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity"
                    title="Download Prescription PDF"
                  >
                    <FileDown className="h-3.5 w-3.5" /> Download Rx PDF
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'single', id: consult._id })}
                    className="p-1.5 hover:bg-red-500/20 text-[#9ca3af] hover:text-red-400 rounded-lg transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-white mb-4">{consult.diagnosis || 'No Diagnosis'}</h3>
              
              {consult.symptoms?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">Symptoms</p>
                  <p className="text-sm text-gray-200">{consult.symptoms.join(', ')}</p>
                </div>
              )}
              
              {consult.medicines?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Pill className="h-3 w-3" /> Medicines
                  </p>
                  <div className="space-y-2">
                    {consult.medicines.map((med, i) => (
                      <div key={i} className="text-sm bg-[#1f2937] p-2 rounded flex justify-between border border-[#374151]">
                        <span className="font-medium text-white">{med.name}</span>
                        <span className="text-[#9ca3af] text-xs">{med.dosage} • {med.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {consult.advice && (
                <div>
                  <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">Advice</p>
                  <p className="text-sm text-gray-200">{consult.advice}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-red-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {deleteTarget.type === 'all' ? "Delete All Patient Records" : "Delete Consultation"}
              </h3>
            </div>
            
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              {deleteTarget.type === 'all' 
                ? `Are you sure you want to delete ALL consultation records for ${name}? This action cannot be undone.`
                : `Are you sure you want to delete this consultation entry for ${name}? This action cannot be undone.`}
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

export default PatientHistory;
