import React, { createContext, useContext, useState, useEffect } from 'react';
import OpenAI from 'openai/index.mjs';
import axios from 'axios';

// Create the OpenAI context
const OpenAIContext = createContext();

// Initialize OpenAI client
let openai = undefined;

export const OpenAIProvider = ({ children }) => {
  const [chatGPTKey, setChatGPTKey] = useState('');
  const [deepSeekKey, setDeepSeekKey] = useState('');
  const [openai, setOpenai] = useState(undefined);
  const [selectedModel, setSelectedModel] = useState('gpt-4.1'); // Default model
  const [systemInformation, setSystemInformation] = useState({});

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/api-keys', {
          headers: { 'x-auth-token': token }
        });

        setChatGPTKey(res.data.chatgpt_key || '');
        setDeepSeekKey(res.data.deepseek_key || '');

        // Initialize OpenAI client based on selected model
        updateOpenAIClient(selectedModel, res.data.chatgpt_key, res.data.deepseek_key);
      } catch (err) {
        console.error(err);
      }
    };
    fetchKeys();

  }, [selectedModel]);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/device/system-information', {
          headers: { 'x-auth-token': token }
        });

        setSystemInformation(res.data);
      } catch (err) {
        console.error('Failed to fetch system information:', err);

        setSystemInformation(undefined);
      }
    };

    const intervalId = setInterval(fetchSystemInfo, 1000); // Fetch every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const updateOpenAIClient = (model, chatgptKey, deepseekKey) => {
    if (model.startsWith('gpt-') && chatgptKey) {
      // Use ChatGPT/OpenAI
      setOpenai(new OpenAI({
        apiKey: chatgptKey,
        dangerouslyAllowBrowser: true
      }));
    } else if (model === 'deepseek-chat' && deepseekKey) {
      // Use DeepSeek
      setOpenai(new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: deepseekKey,
        dangerouslyAllowBrowser: true
      }));
    }
  };

  const generateChatCompletion = async (messages, options = {}) => {
    const { isReasoning = false, isSearching = false, signal } = options;
    const instructionString = `You are Llinux, an expert Linux AI Assistant designed to help users with Linux-related questions, problems, and tasks. Your primary goal is to provide accurate, helpful information and clear terminal commands. Only give one solution, and provide the commands in order.
          Some useful information about the system you are assisting:
          Hostname: ${systemInformation.system_information.hostname},
          Linux Distribution: ${systemInformation.system_information.linux_distribution},
          Package Manager: ${systemInformation.system_information.package_manager},
          Bootloader: ${systemInformation.system_information.bootloader},
          Init System: ${systemInformation.system_information.init_system},
          Kernel Version: ${systemInformation.system_information.kernel_version},
          CPU: ${systemInformation.system_information.cpu},
          GPU: ${systemInformation.system_information.gpu},
          Memory: ${systemInformation.system_information.memory},
          Docker Installation: ${systemInformation.system_information.is_docker_installed},
          Shell: ${systemInformation.system_information.shell},
          Display Manager: ${systemInformation.system_information.display_manager},
          Desktop Environment: ${systemInformation.system_information.desktop_environment},
          Display Server: ${systemInformation.system_information.display_server}`;
    
    return await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        {
          role: "system",
          content: instructionString
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      stream: true,
    }, { signal });
  };

  return (
    <OpenAIContext.Provider value={{ 
      openai, 
      generateChatCompletion, 
      selectedModel, 
      setSelectedModel,
      chatGPTKey,
      deepSeekKey,
      systemInformation
    }}>
      {children}
    </OpenAIContext.Provider>
  );
};

export const useOpenAI = () => {
  const context = useContext(OpenAIContext);
  if (!context) {
    throw new Error('useOpenAI must be used within an OpenAIProvider');
  }
  return context;
};