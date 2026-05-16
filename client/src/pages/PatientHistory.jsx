import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, Activity, Pill, User } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://voicedoc-backend-wkkr.onrender.com";

const PatientHistory = () => {
  const { name } = useParams();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-8 text-center text-[#9ca3af]">Loading...</div>;
  if (!consultations.length) return <div className="p-8 text-center text-[#9ca3af]">No records found for {name}.</div>;

  const patient = consultations[0]; 

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-[#9ca3af] hover:text-white mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="vd-card p-6 mb-8 flex items-center gap-4">
        <div className="bg-[#1f2937] p-4 rounded-full text-primary">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{patient.patientName}</h1>
          <p className="text-[#9ca3af]">{patient.patientAge} years old • {patient.patientGender}</p>
        </div>
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
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-secondary text-sm">
                  {new Date(consult.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
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
    </div>
  );
};

export default PatientHistory;
