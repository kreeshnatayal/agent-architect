'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatResponse {
  response: string;
  error?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [latestUML, setLatestUML] = useState<string | null>(null);

  const commonWorkflows = [
    "Explain this code",
    "Suggest improvements for this function",
    "Write a unit test for this code",
    "Generate a sequence diagram for this interaction",
    "Create a class diagram based on these models",
  ];

  const handleWorkflowClick = (workflowText: string) => {
    setInputMessage(workflowText);
  };

  useEffect(() => {
    // Fetch the latest UML when the component mounts
    const fetchLatestUML = async (): Promise<void> => {
      try {
        const response = await fetch('/api/get-latest-uml');
        if (response.ok) {
          const data = await response.json();
          setLatestUML(data.uml);
        }
      } catch (error) {
        console.error('Error fetching latest UML:', error);
        // Don't set error state, just continue without UML
      }
    };

    void fetchLatestUML();
  }, []);

  const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          uml: latestUML || undefined, // Only send UML if it exists
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data: ChatResponse = await response.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'ai',
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 bg-white border-b shadow-sm">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 hover:bg-gray-100 p-2 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[75%] rounded-xl p-4 shadow-md ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div className="prose prose-sm max-w-none text-inherit">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-700 rounded-xl p-4 shadow-md">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-6 pb-3 pt-2 bg-gray-100 border-t">
        <h3 className="text-sm text-gray-600 mb-2 font-medium">Common Workflows:</h3>
        <div className="flex flex-wrap gap-2">
          {commonWorkflows.map((workflow, index) => (
            <button
              key={index}
              onClick={() => handleWorkflowClick(workflow)}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300/80 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors duration-150 shadow-sm active:bg-gray-300"
            >
              {workflow}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="p-6 pt-3 bg-gray-100 shadow-inner">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask the AI to generate or modify a UML diagram, or type your message..."
            className="flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-500 transition-shadow duration-200 focus:shadow-md"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}