import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, Copy, Trash2, Check, HelpCircle, Loader2 } from 'lucide-react';
import { useOpenAI } from '../context/OpenAIContext';

function CommandList({ commands, onCommandsChange }) {
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const draggedOverItemIndex = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const { generateChatCompletion } = useOpenAI();

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    draggedOverItemIndex.current = index;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedOverItemIndex.current === null) return;
    
    const newCommands = [...commands];
    const draggedItem = newCommands[draggedItemIndex];
    newCommands.splice(draggedItemIndex, 1);
    newCommands.splice(draggedOverItemIndex.current, 0, draggedItem);
    
    onCommandsChange(newCommands);
    setDraggedItemIndex(null);
    draggedOverItemIndex.current = null;
  };

  const handleCommandChange = (index, newValue) => {
    const newCommands = [...commands];
    newCommands[index] = newValue;
    onCommandsChange(newCommands);
  };

  const handleCopy = (command, index) => {
    navigator.clipboard.writeText(command)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleDelete = (index) => {
    const newCommands = [...commands];
    newCommands.splice(index, 1);
    onCommandsChange(newCommands);
  };

  const getCommandExplanation = async (command) => {
    if (!command.trim()) return;

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setIsLoadingExplanation(true);
    setExplanation('');

    try {
      const messages = [
        {
          role: 'user',
          content: `Tell me what this Linux command does: ${command}. Answer in one short paragraph.`
        }
      ];

      const stream = await generateChatCompletion(messages, {
        signal: controller.signal
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkContent = chunk.choices[0]?.delta?.content || '';
        fullResponse += chunkContent;
        setExplanation(fullResponse);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error getting explanation:', error);
        setExplanation('Unable to get explanation for this command.');
      }
    } finally {
      setIsLoadingExplanation(false);
      abortControllerRef.current = null;
    }
  };

  const handleMouseEnter = (e, index, command) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Update cursor position
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setHoveredIndex(index);

    // Set timeout for 1 second
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
      getCommandExplanation(command);
    }, 1000);
  };

  const handleMouseLeave = () => {
    // Clear timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Hide tooltip
    setShowTooltip(false);
    setHoveredIndex(null);
    setExplanation('');
    setIsLoadingExplanation(false);
  };

  const handleMouseMove = (e) => {
    if (showTooltip) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <>
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 flex flex-col h-full">
        <div className="flex items-center space-x-2 mb-4 flex-shrink-0">
          <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-white">Commands to Execute</h3>
          <div className="px-2 py-1 bg-white/10 rounded-full">
            <span className="text-purple-200 text-xs font-medium">{commands.length}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-white/60">
            <HelpCircle size={12} />
            <span>Hover for explanations</span>
          </div>
        </div>
        
        <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
          {commands.map((command, index) => (
            <div
              key={index}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              className={`flex items-center gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 ${
                draggedItemIndex === index ? 'opacity-50' : ''
              }`}
            >
              <div 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={() => setDraggedItemIndex(null)}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition-colors"
              >
                <GripVertical size={16} />
              </div>
              
              <input
                type="text"
                value={command}
                onChange={(e) => handleCommandChange(index, e.target.value)}
                onMouseEnter={(e) => handleMouseEnter(e, index, command)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                className="flex-grow p-2 font-mono text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter command..."
              />
              
              <button
                onClick={() => handleCopy(command, index)}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-md transition-all duration-200 flex-shrink-0 relative"
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <div className="flex items-center gap-1">
                    <Check size={16} className="text-green-400" />
                    <span className="text-xs text-green-400">Copied!</span>
                  </div>
                ) : (
                  <Copy size={16} />
                )}
              </button>
              
              <button
                onClick={() => handleDelete(index)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-md transition-all duration-200 flex-shrink-0"
                title="Delete command"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          {commands.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">No commands added yet</div>
              <div className="text-purple-200 text-xs opacity-75 mt-1">
                Add commands below to get started
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Explanation Tooltip */}
      {showTooltip && (
        <div
          className="fixed z-50 max-w-sm p-3 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-xs font-medium text-purple-200">AI Explanation</span>
            {isLoadingExplanation && (
              <Loader2 size={12} className="text-purple-300 animate-spin" />
            )}
          </div>
          
          <div className="text-sm text-white/90 leading-relaxed">
            {isLoadingExplanation ? (
              <div className="flex items-center space-x-2">
                <span>Analyzing command...</span>
              </div>
            ) : explanation ? (
              explanation
            ) : (
              <span className="text-white/60">Hover over a command to see explanation</span>
            )}
          </div>
          
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-4 w-2 h-2 bg-black/90 border-r border-b border-white/20 transform rotate-45 translate-y-[-1px]"></div>
        </div>
      )}
    </>
  );
}

export default CommandList;