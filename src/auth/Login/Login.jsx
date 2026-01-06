import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import API_URLS from '../../api/api'; 

const Login = () => {
  const navigate = useNavigate();
  
  // State Management
  const [step, setStep] = useState(1); // 1: Identifier, 2: OTP, 3: Password
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  // ==========================
  // STEP 1: REQUEST OTP
  // ==========================
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!identifier) return toast.warning('Please enter email or username');
    
    setLoading(true);
    try {
      const res = await axios.post(API_URLS.Auth.requestLoginOTP, { identifier });
      toast.success(res.data.message);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to find account');
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // STEP 2: VERIFY OTP
  // ==========================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return toast.warning('Please enter the OTP');

    setLoading(true);
    try {
      const res = await axios.post(API_URLS.Auth.verifyLoginOTP, { identifier, otp });
      toast.success(res.data.message);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // STEP 3: PASSWORD LOGIN
  // ==========================
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) return toast.warning('Please enter your password');

    setLoading(true);
    try {
      const res = await axios.post(API_URLS.Auth.loginWithPassword, { identifier, password });
      
      // Save Token
      localStorage.setItem('token', res.data.token);
      
      toast.success('Login Successful! Redirecting...');
      
      // Small delay for UX
      setTimeout(() => {
        navigate('/hidden-dashboard');
      }, 500);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {step === 1 && 'Welcome Back'}
            {step === 2 && 'Security Check'}
            {step === 3 && 'Finish Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && 'Sign in to access your dashboard'}
            {step === 2 && 'We need to verify it\'s really you'}
            {step === 3 && 'Enter your password to continue'}
          </p>
        </div>

        {/* ========================== */}
        {/* STEP 1 FORM: IDENTIFIER    */}
        {/* ========================== */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Username
              </label>
              <input 
                type="text" 
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                placeholder="john@example.com" 
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)} 
                autoFocus
              />
            </div>
            
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50">
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        )}

        {/* ========================== */}
        {/* STEP 2 FORM: OTP           */}
        {/* ========================== */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-800">
                OTP sent to <strong>{identifier}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Enter Verification Code
              </label>
              <input 
                type="text" 
                className="block w-full text-center text-2xl tracking-[0.5em] font-bold text-gray-800 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="000000" 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                autoFocus
              />
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <div className="text-center">
               <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-indigo-600">
                 ← Changed your mind?
               </button>
            </div>
          </form>
        )}

        {/* ========================== */}
        {/* STEP 3 FORM: PASSWORD      */}
        {/* ========================== */}
        {step === 3 && (
          <form onSubmit={handleLogin} className="space-y-6">
             <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center mb-4">
              <p className="text-sm text-green-800 flex items-center justify-center gap-2">
                <span className="text-lg">✓</span> OTP Verified Successfully
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input 
                type="password" 
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                autoFocus
              />
              <div className="text-right mt-1">
                 <Link to="/hidden-forgot-password" class="text-xs text-indigo-600 hover:text-indigo-500">
                   Forgot password?
                 </Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 disabled:opacity-50">
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* FOOTER */}
        {step === 1 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/hidden-register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Register
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;