function CommandInput({
  newCommand,
  setNewCommand,
  handleAddCommand,
  handleExecuteCommands,
  commands,
  isLoading
}) {
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-xl" style={{marginBottom: '10%'}}>
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full"></div>
        <h3 className="text-lg font-semibold text-white">Add New Command</h3>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={newCommand}
          onChange={(e) => setNewCommand(e.target.value)}
          placeholder="Enter command (e.g., ls -la, ps aux)"
          className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          onKeyPress={(e) => e.key === 'Enter' && handleAddCommand()}
        />

        <div className="flex gap-4">
          <button
            onClick={handleAddCommand}
            disabled={!newCommand.trim()}
            className="px-4 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          >
            Add Command
          </button>

          <button
            onClick={handleExecuteCommands}
            disabled={commands.length === 0 || isLoading}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Executing...</span>
              </div>
            ) : (
              `Execute Commands ${commands.length > 0 ? `(${commands.length})` : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommandInput;