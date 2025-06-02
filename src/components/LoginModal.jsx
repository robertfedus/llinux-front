import React, { useState } from 'react';
import axios from 'axios';

const LoginModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/login', formData);
      localStorage.setItem('token', res.data.token);
      onSuccess(res.data.user);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.msg || 'Login failed';
      setServerError(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {serverError && <p className="text-red-600 mb-2">{serverError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <button
            type="submit"
            className="w-full py-2 rounded-full bg-primary text-white font-semibold hover:bg-opacity-90 transition-colors"
            >
                Login
            </button>
            <button
            type="button"
            className="w-full py-2 rounded-full bg-secondary text-white font-semibold hover:bg-opacity-90 transition-colors"
            onClick={onClose}
            >
                Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
