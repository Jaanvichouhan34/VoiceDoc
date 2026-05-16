import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, FileText, PlusCircle, Calendar, Search, ArrowRight, ChevronRight, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://voicedoc-backend-wkkr.onrender.com/api";

const Dashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/consultations`);
      setConsultations(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery === '') {
      fetchConsultations();
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/consultations/search?q=${query}`);
      setConsultations(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const uniquePatients = [...new Set(consultations.map(c => c.patientName))].length;
  const todayConsultations = consultations.filter(c => {
    const date = new Date(c.createdAt);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }).length;

  // Aggregate consultations by date for the chart
  const consultationsByDate = consultations.reduce((acc, c) => {
    const date = new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(consultationsByDate).map(([date, count]) => ({
    date,
    count
  })).reverse().slice(-7); // Last 7 days with data, reversed for chronological order

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-[#9ca3af]">Welcome back! Here's your clinic overview.</p>
        </div>
        <Link to="/new-consultation" className="vd-btn-gradient px-4 py-2 font-medium flex items-center gap-2 shadow-sm">
          <PlusCircle className="h-5 w-5" />
          New Consultation
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex items-center gap-4 hover:bg-[#1f2937]/50 transition-colors cursor-pointer group">
          <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:scale-110 transition-transform">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#9ca3af]">Total Patients</p>
            <p className="text-2xl font-bold text-white">{uniquePatients}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 hover:bg-[#1f2937]/50 transition-colors cursor-pointer group">
          <div className="bg-success/10 p-3 rounded-xl text-success group-hover:scale-110 transition-transform">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#9ca3af]">Today's Visits</p>
            <p className="text-2xl font-bold text-white">{todayConsultations}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 hover:bg-[#1f2937]/50 transition-colors cursor-pointer group">
          <div className="bg-secondary/10 p-3 rounded-xl text-secondary group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#9ca3af]">Total Consultations</p>
            <p className="text-2xl font-bold text-white">{consultations.length}</p>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Consultation Trends</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  border: '1px solid #1f2937', 
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="vd-card overflow-hidden">
        <div className="p-6 border-b border-[#1f2937] flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-white">Recent Consultations</h2>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="vd-input w-full pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#9ca3af]" />
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-[#9ca3af]">Loading...</div>
        ) : consultations.length === 0 ? (
          <div className="p-12 text-center text-[#9ca3af] flex flex-col items-center">
            <div className="bg-[#1f2937] p-4 rounded-full mb-4">
              <FileText className="h-12 w-12 text-[#4b5563]" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                <p className="max-w-md">We couldn't find any consultations matching "{searchQuery}". Try a different search term.</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-2">No consultations yet</h3>
                <p className="max-w-md mb-6">Start your first consultation to see clinical records and analytics here.</p>
                <Link to="/new-consultation" className="vd-btn-gradient px-6 py-3 font-medium flex items-center gap-2 shadow-sm">
                  <PlusCircle className="h-5 w-5" />
                  New Consultation
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {consultations.map(consult => (
              <div 
                key={consult._id} 
                className="p-6 glass-card hover:bg-[#1f2937]/50 transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                onClick={() => navigate(`/patient/${encodeURIComponent(consult.patientName)}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    {consult.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{consult.patientName}</h3>
                    <div className="flex items-center text-sm text-[#9ca3af] mt-1 gap-3">
                      <span>{consult.patientAge} yrs • {consult.patientGender}</span>
                      <span>•</span>
                      <span>{new Date(consult.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium truncate max-w-[200px] border border-secondary/20">
                    {consult.diagnosis || 'Pending Diagnosis'}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/patient-trends/${encodeURIComponent(consult.patientName)}`);
                    }}
                    className="p-2 hover:bg-[#374151] rounded-full text-[#9ca3af] hover:text-white transition-colors"
                    title="View Trends"
                  >
                    <Activity className="h-5 w-5" />
                  </button>
                  <ChevronRight className="h-5 w-5 text-[#9ca3af] group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
