import React from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useOpenAI } from '../context/OpenAIContext';

function ChatArea({
  messages,
  setMessages,
  isReasoning,
  setIsReasoning,
  isSearching,
  setIsSearching,
  isLoading,
  setIsLoading,
  abortController,
  setAbortController,
  messagesEndRef,
  setCommands
}) {
  const { generateChatCompletion } = useOpenAI();

  const handleReason = () => {
    setIsReasoning(true);
    setMessages([...messages, { role: 'system', content: 'Enabling reasoning mode...' }]);
    
    setTimeout(() => {
      setIsReasoning(false);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: "Reasoning mode is now active. I'll think more deeply about complex questions." 
        }
      ]);
    }, 1500);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setMessages([...messages, { role: 'system', content: 'Searching for information...' }]);
    
    // setTimeout(() => {
    //   setIsSearching(false);
    //   setMessages(prev => [
    //     ...prev, 
    //     { 
    //       role: 'assistant', 
    //       content: 'Search mode activated. I can now look for up-to-date information on your queries.' 
    //     }
    //   ]);
    // }, 1500);
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleSendMessage = async (content) => {
    // Add user message
    const updatedMessages = [...messages, { role: 'user', content }];
    setMessages(updatedMessages);
    
    // Create a new assistant message with empty content
    const assistantMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMessage]);
    
    // Create an AbortController for the request
    const controller = new AbortController();
    setAbortController(controller);
    setIsLoading(true);
    
    try {
      const stream = await generateChatCompletion(
        updatedMessages,
        {
          isSearching,
          signal: controller.signal
        }
      );

      // Process the stream
      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkContent = chunk.choices[0]?.delta?.content || '';
        fullResponse += chunkContent;
        
        // Update the assistant message with the new content
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: fullResponse
          };
          return newMessages;
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        // Update the assistant message with the error
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: "Sorry, there was an error processing your request."
          };
          return newMessages;
        });
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleAddCommandFromMessage = (command) => {
    setCommands(prevCommands => {
      // Avoid adding duplicate commands
      if (!prevCommands.includes(command)) {
        return [...prevCommands, command];
      }
      return prevCommands;
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-grow overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              message={message} 
              handleAddCommandFromMessage={handleAddCommandFromMessage} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onReason={handleReason}
        onSearch={handleSearch}
        onStop={handleStopGeneration}
        isReasoning={isReasoning}
        isSearching={isSearching}
        isLoading={isLoading}
      />
    </div>
  );
}

export default ChatArea;