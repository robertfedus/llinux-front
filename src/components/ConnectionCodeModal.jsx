import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Copy, X, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ConnectionCodeModal = ({ onClose }) => {
  console.log("hello!");
  const [code, setCode] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTimerColor = () => {
    if (remaining > 120) return 'text-green-300';
    if (remaining > 60) return 'text-yellow-300';
    return 'text-red-300';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 backdrop-blur-md rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Device Connection Code
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <p className="text-white/80 text-sm leading-relaxed">
            You have <span className="font-semibold text-white">3 minutes</span> to paste this code into the Llinux Client Application.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-300 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="mb-6 p-8 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-white/60">Generating code...</span>
            </div>
          </div>
        )}

        {/* Code Display */}
        {!error && !isLoading && code && (
          <>
            <div
              onClick={copyToClipboard}
              className="mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg text-white break-all pr-4">{code}</span>
                <div className="flex-shrink-0">
                  {copied ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <Copy size={20} className="text-white/60 group-hover:text-white transition-colors" />
                  )}
                </div>
              </div>
            </div>

            {/* Copy Feedback */}
            {copied && (
              <div className="mb-4 p-2 bg-green-500/20 border border-green-400/30 rounded-lg">
                <p className="text-green-200 text-sm text-center">Code copied to clipboard!</p>
              </div>
            )}

            {/* Timer */}
            {remaining > 0 && (
              <div className="mb-6 flex items-center justify-center space-x-2 p-3 bg-black/20 rounded-xl border border-white/10">
                <Clock size={16} className={getTimerColor()} />
                <span className={`font-mono text-lg font-bold ${getTimerColor()}`}>
                  {formatTime(remaining)}
                </span>
                <span className="text-white/60 text-sm">remaining</span>
              </div>
            )}
          </>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={fetchCode}
            disabled={remaining > 0 || isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              remaining > 0 || isLoading
                ? 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>New Code</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCodeModal;