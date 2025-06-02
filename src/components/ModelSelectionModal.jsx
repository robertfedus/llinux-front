import React, { useEffect, useState } from 'react';
import { useOpenAI } from '../context/OpenAIContext';
import openaiLogo from './../assets/openai_logo.png';
import deepseekLogo from './../assets/deepseek_logo.png';
import { Check } from 'lucide-react';

const modelOptions = [
  { name: 'GPT-4.1', value: 'gpt-4.1', logo: openaiLogo, description: 'Great for quick coding and analysis' },
  { name: 'GPT-4o', value: 'gpt-4o', logo: openaiLogo, description: 'Great for most tasks' },
  { name: 'o3', value: 'o3', logo: openaiLogo, description: 'Powerful at advanced reasoning' },
  { name: 'o4-mini', value: 'o4-mini', logo: openaiLogo, description: 'Fast at advanced reasoning' },
  { name: 'DeepSeek-V3', value: 'deepseek-chat', logo: deepseekLogo, description: 'Great for most tasks' },
  { name: 'DeepSeek-R1', value: 'deepseek-reasoner', logo: deepseekLogo, description: 'Powerful at advanced reasoning' }
];

const ModelSelectionModal = ({ onClose }) => {
  const { selectedModel, setSelectedModel } = useOpenAI();

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    // Optionally close the modal immediately after selection
    // onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Select a Model</h2>
        <div className="space-y-4">
          {modelOptions.map(({ name, value, logo, description }) => (
            <div key={value} className="space-y-1">
              <button
                onClick={() => handleModelSelect(value)}
                className={`w-full flex items-center gap-4 p-3 border rounded transition relative ${
                  selectedModel === value ? 'bg-green-100 border-green-500' : 'hover:bg-gray-100'
                }`}
              >
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className="h-6 max-w-[100px] object-contain"
                />
                <span className="text-lg font-medium flex-1 text-left">{name}</span>
                {selectedModel === value && <Check className="text-green-600" />}
              </button>
              {description && (
                <p className="text-sm text-gray-600 ml-1">{description}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
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

export default ModelSelectionModal;