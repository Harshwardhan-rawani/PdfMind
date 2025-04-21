
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppHeader from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Array<{ id: string; content: string; isUser: boolean; timestamp: Date }>>([
    {
      id: '1',
      content: "Hello! I've analyzed your document. How can I help you with it today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      // Sample responses
      const responses = [
        "Based on your document, I found that the key information is in section 3.2 on page 12.",
        "The diagram on page 8 shows a correlation between the variables you're asking about.",
        "According to your document, the main conclusions are outlined in the executive summary.",
        "I've found several references to that topic in your document. Would you like me to summarize them?",
        "The financial projections in your document indicate a 15% growth rate over the next quarter.",
      ];
      
      // Random response for demo purposes
      const aiResponse = {
        id: `ai-${Date.now()}`,
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="max-w-4xl w-full mx-auto flex flex-col flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
            <h1 className="text-xl font-semibold mb-2">Chatting with: Document {id}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask questions about your document and get AI-powered answers
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-3xl ${message.isUser ? 'flex-row-reverse' : ''}`}>
                      {!message.isUser && (
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`px-4 py-3 rounded-lg ${
                          message.isUser
                            ? 'bg-primary text-white rounded-tr-none ml-3'
                            : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isUser ? 'text-primary-foreground/70' : 'text-gray-500 dark:text-gray-400'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.isUser && (
                        <Avatar className="h-8 w-8 ml-3">
                          <AvatarImage src="https://randomuser.me/api/portraits/men/23.jpg" alt="User" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start max-w-3xl">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                      </Avatar>
                      <div className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 rounded-tl-none">
                        <div className="flex space-x-2 items-center h-6">
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <form onSubmit={handleSend} className="flex space-x-2">
              <Input
                placeholder="Ask a question about your document..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                className="bg-gradient-primary hover:opacity-90"
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                Send
              </Button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Ask questions like "Summarize this document" or "What does the diagram on page 5 represent?"
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
