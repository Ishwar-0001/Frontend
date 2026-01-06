import React, { useState } from 'react';
import axios from 'axios'; 
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import API_URLS from '../../api/api'; 

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================
  // STEP 1: REGISTER
  // ==========================
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { firstName, lastName, email, password } = formData;
      // Using axios directly with the URL string from your api.js
      const res = await axios.post(API_URLS.Auth.register, { 
        firstName, 
        lastName, 
        email, 
        password 
      });
      
      toast.success(res.data.message || 'OTP Sent to email!');
      setStep(2); // Move to OTP verification
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // STEP 2: VERIFY OTP
  // ==========================
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(API_URLS.Auth.verifyEmail, { 
        email: formData.email, 
        otp: formData.otp 
      });
      
      toast.success(res.data.message || 'Verification successful!');
      navigate('/hidden-login'); 
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background Container
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Card Container */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 
              ? 'Join TexorLab and start building today.' 
              : 'Please enter the verification code sent to your email.'}
          </p>
        </div>

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                  placeholder="John"
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                  placeholder="Doe"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                placeholder="john@example.com"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              } transition duration-200 ease-in-out`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : 'Sign Up'}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/hidden-login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Form */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerify}>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-800">
                We've sent a 6-digit code to <strong>{formData.email}</strong>.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Enter OTP
              </label>
              <input
                name="otp"
                type="text"
                maxLength="6"
                required
                autoFocus
                className="block w-full text-center text-2xl tracking-[0.5em] font-bold text-gray-800 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="000000"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              } transition duration-200`}
            >
              {loading ? 'Verifying...' : 'Verify & Finish'}
            </button>

            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                ← Wrong email? Go back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;