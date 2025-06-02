import React from 'react';

function CommandInput({ 
  newCommand, 
  setNewCommand, 
  handleAddCommand, 
  handleExecuteCommands, 
  commands,
  isLoading 
}) {
  return (
    <div className="mt-auto">
      <input
        type="text"
        value={newCommand}
        onChange={(e) => setNewCommand(e.target.value)}
        placeholder="Enter command"
        className="w-full p-2 border rounded mb-2 text-sm"
        onKeyPress={(e) => e.key === 'Enter' && handleAddCommand()}
      />
      <div className="flex space-x-2">
        <button
          onClick={handleAddCommand}
          className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Add Command
        </button>
        <button
          onClick={handleExecuteCommands}
          className="w-1/2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={commands.length === 0 || isLoading}
        >
          {isLoading ? 'Executing...' : 'Execute Commands'}
        </button>
      </div>
    </div>
  );
}

export default CommandInput;