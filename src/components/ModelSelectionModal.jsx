import { useOpenAI } from '../context/OpenAIContext';
import openaiLogo from './../assets/openai_logo.png';
import deepseekLogo from './../assets/deepseek_logo.png';
import { Check, X } from 'lucide-react';

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
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 backdrop-blur-md rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Select a Model
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {modelOptions.map(({ name, value, logo, description }) => (
            <div key={value} className="space-y-2">
              <button
                onClick={() => handleModelSelect(value)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 relative group ${
                  selectedModel === value 
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-400/50 shadow-lg' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
                }`}
              >
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className="h-8 max-w-[100px] object-contain drop-shadow-sm"
                />
                <div className="flex-1 text-left">
                  <span className="text-lg font-medium text-white">{name}</span>
                </div>
                {selectedModel === value && (
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </button>
              {description && (
                <p className="text-sm text-white/60 ml-1 px-4">{description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelSelectionModal;