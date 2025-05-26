import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../../Pages/Redux/Slices/apiAuthSlice';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("email", email);
    
    try {
      const res = await forgotPassword( {email }).unwrap();
      toast.success(res?.message || 'Reset link sent to your email');
      setEmail('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-pink-100 to-yellow-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">Forgot Password</h2>
        <p className="text-sm text-center text-gray-600">Enter your registered email</p>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
