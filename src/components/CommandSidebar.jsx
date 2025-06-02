import React, { useState } from 'react';
import axios from 'axios';
import CommandList from './CommandList';
import CommandOutputList from './CommandOutputList';
import CommandInput from './CommandInput';

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
          deviceId: "198692543232975",
          commands: commands
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );

      console.log('Commands executed successfully:', response.data);
      setCommands([]);
      setCommandResults(response.data.results || []);
      
    } catch (error) {
      console.error('Error executing commands:', error);
      setCommandResults([{
        command: "Error",
        output: error.message,
        success: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/2 bg-white border-r p-4 flex flex-col">
      <div className="flex flex-1 mb-4 space-x-4 overflow-hidden">
        {/* Command List Column */}
        <CommandList commands={commands} onCommandsChange={(newCommands) => setCommands(newCommands)} />
        
        {/* Results Column */}
        <CommandOutputList results={commandResults} />
      </div>

      {/* Command Input and buttons */}
      <CommandInput
        newCommand={newCommand}
        setNewCommand={setNewCommand}
        handleAddCommand={handleAddCommand}
        handleExecuteCommands={handleExecuteCommands}
        commands={commands}
        isLoading={isLoading}
      />
    </div>
  );
}

export default CommandSidebar;