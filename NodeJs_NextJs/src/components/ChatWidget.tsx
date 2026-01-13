'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = async (messageText?: string) => {
    const question = (messageText || userInput).trim();
    if (!question || isLoading) return;

    // Add user message
    addMessage({
      role: 'user',
      content: question,
      timestamp: new Date(),
    });

    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      const content = data.success
        ? data.answer
        : `เกิดข้อผิดพลาด: ${data.error || 'Unknown error'}`;

      addMessage({
        role: 'assistant',
        content,
        timestamp: new Date(),
      });

      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (err) {
      addMessage({
        role: 'assistant',
        content: `เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuickMessage = (message: string) => {
    sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const quickActions = [
    { icon: '💱', label: 'อัตราแลกเปลี่ยนวันนี้', query: 'อัตราแลกเปลี่ยนวันนี้' },
    { icon: '📦', label: 'สินเชื่อส่งออก', query: 'สินเชื่อส่งออก' },
    { icon: '📝', label: 'Letter of Credit', query: 'บริการ L/C' },
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all z-50 flex items-center justify-center ${isOpen ? 'scale-90' : 'hover:scale-110'}`}
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <>
            <span className="text-2xl">💬</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold">EXIM Bank AI</h3>
                  <span className="text-xs text-primary-200 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    ออนไลน์
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearChat}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  title="ล้างการสนทนา"
                >
                  🗑️
                </button>
                <button
                  onClick={toggleChat}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  title="ปิด"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center text-3xl mb-4">
                  🤖
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">สวัสดีค่ะ!</h4>
                <p className="text-gray-600 mb-1">ยินดีต้อนรับสู่ EXIM Bank AI Assistant</p>
                <p className="text-sm text-gray-500 mb-6">สอบถามข้อมูลบริการธนาคาร หรือต้องการความช่วยเหลือ พิมพ์ข้อความได้เลยค่ะ</p>
                
                {/* Quick Actions */}
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => sendQuickMessage(action.query)}
                      className="block w-full text-left px-4 py-3 bg-white rounded-lg text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors border border-gray-200"
                    >
                      <span className="mr-2">{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{ __html: msg.content }} />
                    <p
                      className={`text-xs mt-1 ${
                        msg.role === 'user' ? 'text-primary-200' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0">
                  🤖
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="พิมพ์ข้อความ..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !userInput.trim()}
                className="w-10 h-10 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <span className="text-lg">➤</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
