import React, { useState, useRef } from 'react';
import { GripVertical, Copy, Trash2 } from 'lucide-react';

function CommandList({ commands, onCommandsChange }) {
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const draggedOverItemIndex = useRef(null);
  
  // Handle drag start
  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };
  
  // Handle drag over another item
  const handleDragOver = (e, index) => {
    e.preventDefault();
    draggedOverItemIndex.current = index;
  };
  
  // Handle drop to reorder
  const handleDrop = (e) => {
    e.preventDefault();
    
    if (draggedItemIndex === null || draggedOverItemIndex.current === null) return;
    
    const newCommands = [...commands];
    const draggedItem = newCommands[draggedItemIndex];
    
    // Remove the dragged item from its original position
    newCommands.splice(draggedItemIndex, 1);
    
    // Insert the dragged item at the new position
    newCommands.splice(draggedOverItemIndex.current, 0, draggedItem);
    
    // Update the commands array through props
    onCommandsChange(newCommands);
    
    // Reset drag state
    setDraggedItemIndex(null);
    draggedOverItemIndex.current = null;
  };
  
  // Handle text change
  const handleCommandChange = (index, newValue) => {
    const newCommands = [...commands];
    newCommands[index] = newValue;
    onCommandsChange(newCommands);
  };
  
  // Handle copy to clipboard
  const handleCopy = (command) => {
    navigator.clipboard.writeText(command)
      .then(() => {
        // You could add a notification here if you wanted
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  // Handle delete command
  const handleDelete = (index) => {
    const newCommands = [...commands];
    newCommands.splice(index, 1);
    onCommandsChange(newCommands);
  };
  
  return (
    <div className="w-full md:w-1/2 overflow-auto border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Commands to Execute</h3>
      <div className="space-y-2">
        {commands.map((command, index) => (
          <div 
            key={index}
            className={`flex items-center rounded border ${draggedItemIndex === index ? 'border-blue-500 opacity-50' : 'border-gray-200'}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            onDragEnd={() => setDraggedItemIndex(null)}
          >
            <div className="p-2 cursor-grab text-gray-400 hover:text-gray-600 flex-shrink-0">
              <GripVertical size={16} />
            </div>
            
            <input
              type="text"
              value={command}
              onChange={(e) => handleCommandChange(index, e.target.value)}
              className="flex-grow p-2 font-mono text-sm bg-gray-50 focus:outline-none rounded-md"
            />
            
            <button 
              onClick={() => handleCopy(command)}
              className="p-2 text-gray-400 hover:text-blue-500 flex-shrink-0"
              title="Copy to clipboard"
            >
              <Copy size={16} />
            </button>
            
            <button 
              onClick={() => handleDelete(index)}
              className="p-2 text-gray-400 hover:text-red-500 flex-shrink-0"
              title="Delete command"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommandList;