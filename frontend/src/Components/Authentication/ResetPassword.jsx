import React, { useState } from 'react';
import { useResetPasswordMutation } from '../../Pages/Redux/Slices/apiAuthSlice';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await resetPassword({ token, password, confirmPassword }).unwrap();
      toast.success(res?.message || 'Password reset successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-yellow-100 via-pink-100 to-purple-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">Reset Password</h2>
        <p className="text-sm text-center text-gray-600">Enter your new password</p>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            required
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            required
            name='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
