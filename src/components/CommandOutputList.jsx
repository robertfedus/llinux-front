import React from 'react';

function CommandOutputList({ results }) {
  return (
    <div className="w-full md:w-1/2 overflow-auto border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Execution Results</h3>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div 
            key={index}
            className={`p-2 rounded break-words font-mono text-sm ${result.success ? 'bg-green-50' : 'bg-red-50'}`}
          >
            <div className="font-semibold">$ {result.command}</div>
            <div className="mt-1 whitespace-pre-wrap">{result.output}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommandOutputList;