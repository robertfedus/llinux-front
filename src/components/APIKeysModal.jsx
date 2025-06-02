import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const APIKeysModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ chatgpt_key: '', deepseek_key: '' });
  const [existingKeys, setExistingKeys] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/api-keys', {
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
        console.error(err);
      }
    };
    fetchKeys();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    const url = 'http://localhost:3000/api/api-keys';
    const method = existingKeys ? 'put' : 'post';

    try {
      await axios[method](url, formData, {
        headers: { 'x-auth-token': token }
      });
      onClose();
    } catch (err) {
      setError('Failed to save API keys');
    }
  };

  const handleDeleteKey = async (key) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/api/api-keys?${key}=true`, {
        headers: { 'x-auth-token': token }
      });
      setFormData((prev) => ({ ...prev, [key + '_key']: '' }));
    } catch (err) {
      setError(`Failed to delete ${key} API key`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Manage API Keys</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ChatGPT API Key"
              value={formData.chatgpt_key}
              onChange={(e) => setFormData({ ...formData, chatgpt_key: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {formData.chatgpt_key && (
              <Trash2
                className="text-red-600 cursor-pointer hover:text-red-800"
                onClick={() => handleDeleteKey('chatgpt')}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="DeepSeek API Key"
              value={formData.deepseek_key}
              onChange={(e) => setFormData({ ...formData, deepseek_key: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {formData.deepseek_key && (
              <Trash2
                className="text-red-600 cursor-pointer hover:text-red-800"
                onClick={() => handleDeleteKey('deepseek')}
              />
            )}
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="py-2 px-4 rounded-full bg-primary text-white font-semibold hover:bg-opacity-90 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              className="py-2 px-4 rounded-full bg-secondary text-white font-semibold hover:bg-opacity-90 transition-colors"
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

export default APIKeysModal;
