'use client';

import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
}

export function RepChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'system', content: 'Hi! I\'m your South Bound assistant. Ask me anything about destinations, pricing, or policies.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock response
    setTimeout(() => {
      const responseMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'system', 
        content: "This is a mock response. In the future, I'll connect to our knowledge base to answer questions about " + userMsg.content 
      };
      setMessages(prev => [...prev, responseMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-full bg-white p-0 overflow-hidden border-stone-200">
      <div className="p-4 border-b border-stone-100 bg-stone-50">
        <h3 className="font-bold text-stone-800 flex items-center gap-2">
            🤖 Rep GPT <span className="text-xs font-normal text-stone-500 px-2 py-0.5 bg-stone-200 rounded-full">Beta</span>
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-[#E86B32] text-white rounded-tr-none' 
                : 'bg-white border border-stone-200 text-stone-700 rounded-tl-none shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
            <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-stone-100">
        <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#E86B32] focus:border-transparent text-sm"
            />
            <button 
                onClick={handleSend}
                className="p-2 bg-[#E86B32] text-white rounded-xl hover:bg-[#F1783A] transition-colors"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
      </div>
    </Card>
  );
}

