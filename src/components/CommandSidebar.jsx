import React, { useState } from 'react';
import axios from 'axios';
import CommandList from './CommandList';
import CommandOutputList from './CommandOutputList';
import CommandInput from './CommandInput';
import { MessageSquare, Terminal } from 'lucide-react';

function CommandSidebar({
  commands,
  setCommands,
  commandResults,
  setCommandResults,
  isLoading,
  setIsLoading
}) {
  const [newCommand, setNewCommand] = useState('');

  const handleAddCommand = () => {
    if (newCommand.trim()) {
      setCommands([...commands, newCommand.trim()]);
      setNewCommand('');
    }
  };

  const handleExecuteCommands = async () => {
    if (commands.length === 0) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/device/send-commands',
        {
          deviceId: '198692543232975',
          commands,
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      console.log('Commands executed successfully:', response.data);
      setCommands([]);
      setCommandResults(response.data.results || []);
    } catch (error) {
      console.error('Error executing commands:', error);
      setCommandResults([{ command: 'Error', output: error.message, success: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/2 h-screen flex flex-col overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900 shadow-2xl">
      {/* Sidebar Header */}
      <div className=" bg-black/20">
        <div className="px-6 py-4 flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Terminal size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Command Panel</h2>
              <p className="text-sm text-white/60">Execute commands on your connected device</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CommandList
            commands={commands}
            onCommandsChange={(newCommands) => setCommands(newCommands)}
          />
          <CommandOutputList results={commandResults} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-6 flex-shrink-0">
        <CommandInput
          newCommand={newCommand}
          setNewCommand={setNewCommand}
          handleAddCommand={handleAddCommand}
          handleExecuteCommands={handleExecuteCommands}
          commands={commands}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default CommandSidebar;
