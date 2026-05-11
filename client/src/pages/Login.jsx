import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Activity } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    registrationNumber: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary">
          <Stethoscope className="h-16 w-16 animate-pulse-icon" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          VoiceDoc
        </h2>
        <p className="mt-2 text-center text-sm text-[#9ca3af]">
          AI-powered medical scribe for doctors
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="vd-card py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af]">Full Name</label>
                  <input name="name" type="text" required className="mt-1 block w-full py-2 px-3 vd-input" onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af]">Specialization</label>
                  <input name="specialization" type="text" required className="mt-1 block w-full py-2 px-3 vd-input" onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af]">Registration Number</label>
                  <input name="registrationNumber" type="text" required className="mt-1 block w-full py-2 px-3 vd-input" onChange={handleChange} />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-[#9ca3af]">Email address</label>
              <input name="email" type="email" required className="mt-1 block w-full py-2 px-3 vd-input" onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9ca3af]">Password</label>
              <input name="password" type="password" required className="mt-1 block w-full py-2 px-3 vd-input" onChange={handleChange} />
            </div>

            {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 vd-btn-gradient text-sm font-medium">
                {isLogin ? 'Sign in' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1f2937]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#111827] text-[#9ca3af]">Or</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:text-blue-400 font-medium transition-colors">
                {isLogin ? 'Create a new account' : 'Sign in to existing account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
