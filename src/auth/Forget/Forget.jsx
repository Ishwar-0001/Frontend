import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import API_URLS from '../../api/api'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.warning('Please enter your email address');

    setLoading(true);
    try {
      const res = await axios.post(API_URLS.Auth.forgotPassword, { email });
      toast.success(res.data.message);
      // Optional: Clear email after success
      setEmail(''); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            {/* Key Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 11l-1.464 1.414A2 2 0 018.657 12l-1.415-1.414A2 2 0 015.828 10l-1.414-1.414a2 2 0 010-2.828l6.364-6.364a2 2 0 012.828 0 2 2 0 010 2.828 6 6 0 015.743 7.743z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input 
              id="email"
              type="email" 
              className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            } transition duration-200 ease-in-out`}
          >
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link to="/hidden-login" className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;