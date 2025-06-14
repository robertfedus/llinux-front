import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, X, Eye, EyeOff, Key, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { API_URL } from "./../config";

const APIKeysModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ chatgpt_key: '', deepseek_key: '' });
  const [existingKeys, setExistingKeys] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showKeys, setShowKeys] = useState({ chatgpt: false, deepseek: false });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchKeys = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/api-keys`, {
          headers: { 'x-auth-token': token }
        });
        if (res.data.chatgpt_key || res.data.deepseek_key) {
          setFormData({
            chatgpt_key: res.data.chatgpt_key || '',
            deepseek_key: res.data.deepseek_key || ''
          });
          setExistingKeys(true);
        }
      } catch (err) {
        setError('Failed to load API keys');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKeys();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);
    
    const token = localStorage.getItem('token');
    const url = `${API_URL}/api/api-keys`;
    const method = existingKeys ? 'put' : 'post';
    
    try {
      await axios[method](url, formData, {
        headers: { 'x-auth-token': token }
      });
      setSuccess('API keys saved successfully!');
      setExistingKeys(true);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save API keys');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKey = async (key) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/api/api-keys?${key}=true`, {
        headers: { 'x-auth-token': token }
      });
      setFormData((prev) => ({ ...prev, [key + '_key']: '' }));
      setSuccess(`${key.toUpperCase()} API key deleted successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to delete ${key} API key`);
    }
  };

  const toggleShowKey = (keyType) => {
    setShowKeys(prev => ({ ...prev, [keyType]: !prev[keyType] }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 backdrop-blur-md rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Key size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Manage API Keys
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading && (
          <div className="mb-6 p-8 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Loader2 size={20} className="text-white animate-spin" />
              <span className="text-white/60">Loading API keys...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-300 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-400/30 rounded-xl flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-300 flex-shrink-0" />
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        )}

        {!isLoading && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-white/80 text-sm font-medium">
                ChatGPT API Key
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type={showKeys.chatgpt ? "text" : "password"}
                    placeholder="Place ChatGPT API key here"
                    value={formData.chatgpt_key}
                    onChange={(e) => setFormData({ ...formData, chatgpt_key: e.target.value })}
                    className="w-full p-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
                  />
                  {formData.chatgpt_key && (
                    <button
                      type="button"
                      onClick={() => toggleShowKey('chatgpt')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors"
                    >
                      {showKeys.chatgpt ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                {formData.chatgpt_key && (
                  <button
                    type="button"
                    onClick={() => handleDeleteKey('chatgpt')}
                    className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl border border-red-400/30 transition-all duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-white/80 text-sm font-medium">
                DeepSeek API Key
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type={showKeys.deepseek ? "text" : "password"}
                    placeholder="Place DeepSeek API key here"
                    value={formData.deepseek_key}
                    onChange={(e) => setFormData({ ...formData, deepseek_key: e.target.value })}
                    className="w-full p-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200"
                  />
                  {formData.deepseek_key && (
                    <button
                      type="button"
                      onClick={() => toggleShowKey('deepseek')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors"
                    >
                      {showKeys.deepseek ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                {formData.deepseek_key && (
                  <button
                    type="button"
                    onClick={() => handleDeleteKey('deepseek')}
                    className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl border border-red-400/30 transition-all duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                <span>{isSaving ? 'Saving...' : 'Save Keys'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default APIKeysModal;