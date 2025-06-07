import React from 'react';

function CommandOutputList({ results }) {
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-4 flex-shrink-0">
        <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full"></div>
        <h3 className="text-lg font-semibold text-white">Execution Results</h3>
        <div className="px-2 py-1 bg-white/10 rounded-full">
          <span className="text-purple-200 text-xs font-medium">{results.length}</span>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${
                result.success !== false ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span className="font-mono text-sm text-purple-200 bg-white/10 px-2 py-1 rounded">
                $ {result.command}
              </span>
            </div>

            <pre className={`font-mono text-xs whitespace-pre-wrap p-3 rounded-md border border-white/10 ${
              result.success !== false 
                ? 'bg-green-500/10 text-green-200 border-green-500/20' 
                : 'bg-red-500/10 text-red-200 border-red-500/20'
            }`}>
              {result.output || 'No output'}
            </pre>
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">No results yet</div>
            <div className="text-purple-200 text-xs opacity-75 mt-1">
              Execute commands to see results here
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommandOutputList;