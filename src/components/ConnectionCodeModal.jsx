import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Copy } from 'lucide-react';

const ConnectionCodeModal = ({ onClose }) => {
  console.log("hello!");
  const [code, setCode] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCode = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        'http://localhost:3000/api/device/connection-code',
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      // console.log(res);
      setCode(res.data.code);
      setExpiresAt(new Date(res.data.expiresAt));
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Unable to fetch connection code');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCode();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!expiresAt) return;
    
    const timerId = setInterval(() => {
      const now = new Date();
      const diffMs = expiresAt - now;
      if (diffMs <= 0) {
        setRemaining(0);
        clearInterval(timerId);
      } else {
        setRemaining(Math.floor(diffMs / 1000));
      }
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [expiresAt]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Device Connection Code</h2>
        <p>You have 3 minutes to paste this code into the Llinux Client Application.</p>
        <br />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        
        {!error && (
          <>
            <div 
              onClick={copyToClipboard} 
              className="flex items-center justify-between bg-gray-100 p-4 rounded cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <span className="font-mono break-all">{code}</span>
              <Copy className="w-5 h-5 text-gray-600" />
            </div>
            <br />
            
            {!isLoading && remaining > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Expires in: {formatTime(remaining)}
              </p>
            )}
          </>
        )}
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={fetchCode}
            disabled={remaining > 0}
            className={`py-2 px-4 rounded-full bg-primary text-white font-semibold transition-colors ${remaining > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
          >
            New Code
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-full bg-secondary text-white font-semibold hover:bg-opacity-90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCodeModal;