import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Activity, Heart, Thermometer, Scale } from 'lucide-react';

const PatientTrends = () => {
  const { name } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/consultations/patient/${name}`);
        // Format data for charts
        const formattedData = res.data.map(item => ({
          date: new Date(item.createdAt).toLocaleDateString(),
          bp: item.vitals?.bloodPressure || '',
          pulse: item.vitals?.heartRate || null,
          temp: item.vitals?.temperature || null,
          weight: item.vitals?.weight || null,
          symptoms: item.symptoms?.join(', ') || 'None'
        }));
        setData(formattedData);
      } catch (err) {
        console.error('Failed to fetch trends', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [name]);

  // Helper to extract systolic BP for charting (e.g., "120/80" -> 120)
  const getSystolic = (bp) => {
    if (!bp) return null;
    const parts = bp.split('/');
    return parseInt(parts[0], 10) || null;
  };

  const chartData = data.map(item => ({
    ...item,
    systolic: getSystolic(item.bp)
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard" className="text-[#9ca3af] hover:text-white transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Patient Trends: {name}</h1>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#9ca3af]">Loading trends...</div>
      ) : data.length === 0 ? (
        <div className="vd-card p-12 text-center text-[#9ca3af]">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No data available for this patient.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Heart Rate Chart */}
          <div className="vd-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Heart Rate (BPM)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="pulse" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} name="Pulse" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Temperature Chart */}
          <div className="vd-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-yellow-500" />
              Temperature (°F)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="temp" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308' }} name="Temp" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weight Chart */}
          <div className="vd-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-green-500" />
              Weight (kg)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Weight" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Systolic BP Chart */}
          <div className="vd-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Systolic Blood Pressure
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={['dataMin - 20', 'dataMax + 20']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Systolic BP" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTrends;
