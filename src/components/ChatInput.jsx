import React, { useState } from 'react';

function ChatInput({ 
  onSendMessage, 
  onReason, 
  onSearch, 
  onStop, 
  isReasoning, 
  isSearching, 
  isLoading 
}) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() === '') return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-3xl mx-auto space-y-3">
        {/* Reason and Search buttons */}
        <div className="flex justify-center space-x-4">
          {/* <button
            onClick={onReason}
            disabled={isReasoning || isLoading}
            className={`px-4 py-2 rounded-md transition-colors flex items-center ${
              isReasoning
                ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                : 'bg-accent1 text-white hover:bg-opacity-90'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            {isReasoning ? 'Reasoning...' : 'Reason'}
          </button> */}
          
          {/* <button
            onClick={onSearch}
            disabled={isSearching || isLoading}
            className={`px-4 py-2 rounded-md transition-colors flex items-center ${
              isSearching
                ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-opacity-90'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            {isSearching ? 'Searching...' : 'Search'}
          </button> */}
          
          {isLoading && (
            <button
              onClick={onStop}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Stop
            </button>
          )}
        </div>
        
        {/* Message input */}
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Type your message here..."
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent1"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className={`p-3 rounded-r-lg transition-colors ${
              !message.trim() || isLoading
                ? 'bg-gray-400 text-gray-200'
                : 'bg-primary hover:bg-opacity-90 text-white'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;