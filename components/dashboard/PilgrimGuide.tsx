
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { getChatResponse } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';

// SVG Icon Component
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;

/**
 * AI Pilgrim Guide Component.
 * This component provides a chatbot interface for users to interact with. It serves as a
 * knowledgeable local guide, answering questions in the user's native language.
 * The AI responses are simulated through the Gemini service.
 */
const PilgrimGuide: React.FC = () => {
  const { translations } = useLocalization();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: translations.guide.welcomeMessage },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate calling the Gemini API
      const aiResponse = await getChatResponse(messages, input);
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: translations.guide.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[70vh]">
      <h3 className="text-2xl font-bold mb-4 flex-shrink-0">{translations.guide.title}</h3>
      
      <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && <img src="https://i.imgur.com/8Q1Z1zN.png" alt="AI Avatar" className="w-8 h-8 rounded-full" />}
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex items-end gap-2 justify-start">
                <img src="https://i.imgur.com/8Q1Z1zN.png" alt="AI Avatar" className="w-8 h-8 rounded-full" />
                <div className="px-4 py-2 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm">
                    <Spinner size="sm"/>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={translations.guide.placeholder}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:ring-orange-500 focus:border-orange-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="px-4 rounded-full">
          <SendIcon />
        </Button>
      </div>
    </Card>
  );
};

export default PilgrimGuide;
