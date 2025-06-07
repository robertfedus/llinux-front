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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-white/10 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md shadow-2xl">
      <div className="max-w-4xl mx-auto p-6">
        {/* Action Buttons Row */}
        <div className="flex justify-center items-center space-x-3 mb-4">
          {isLoading && (
            <button
              onClick={onStop}
              className="group px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 group-hover:animate-pulse" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Stop Generation</span>
            </button>
          )}
        </div>

        {/* Message Input */}
        <div className="relative">
          <div className="flex items-start space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full p-4 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200/75 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-none min-h-[60px] max-h-[200px]"
                disabled={isLoading}
                rows="1"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(147, 51, 234, 0.5) transparent'
                }}
              />
              
              {/* Character count indicator */}
              {message.length > 500 && (
                <div className="absolute bottom-2 right-4 text-xs text-purple-200/75">
                  {message.length}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!message.trim() || isLoading}
              className={`h-[60px] group p-4 rounded-xl transition-all duration-300 flex items-center justify-center min-w-[60px] ${
                !message.trim() || isLoading
                  ? 'bg-white/10 text-purple-200/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-3 text-xs text-purple-200/75">
          <div className="flex items-center space-x-4">
            <span>Press Enter to send</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Shift</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Enter</kbd>
            <span>for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;