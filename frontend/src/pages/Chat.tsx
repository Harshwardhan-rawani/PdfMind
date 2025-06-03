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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-200 via-green-100 to-pink-200 dark:from-gray-900 dark:via-blue-900 dark:via-green-900 dark:to-pink-900 flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Document Information Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-xl shadow-lg p-4 sm:p-6 border border-white/20 dark:border-gray-700/20">
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Document Information</h2>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
              <div>
                <h3 className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">Document ID</h3>
                <p className="text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">{id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">Upload Date</h3>
                <p className="text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">March 15, 2024</p>
              </div>
              <div>
                <h3 className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">Pages</h3>
                <p className="text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">24 pages</p>
              </div>
              <div>
                <h3 className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">File Type</h3>
                <p className="text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">PDF</p>
              </div>
              <div>
                <h3 className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">File Size</h3>
                <p className="text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">2.4 MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col min-h-[calc(100vh-12rem)]">
          <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 sm:p-6 border-b border-white/20 dark:border-gray-700/20">
              <h1 className="text-xl font-semibold mb-2 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Chat with Document</h1>
              <p className="text-sm bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
                Ask questions about your document and get AI-powered answers
              </p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                      <div className={`flex items-start max-w-[85%] sm:max-w-3xl ${message.isUser ? 'flex-row-reverse' : ''}`}>
                        {!message.isUser && (
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
                            message.isUser
                              ? 'bg-primary/80 backdrop-blur-sm text-white rounded-tr-none ml-3'
                              : 'bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-tl-none'
                          }`}
                        >
                          <p className={`break-words ${!message.isUser ? 'bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent' : ''}`}>{message.content}</p>
                          <p className={`text-xs mt-1 ${message.isUser ? 'text-primary-foreground/70' : 'bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-400 dark:to-gray-200 bg-clip-text text-transparent'}`}>
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
                      <div className="flex items-start max-w-[85%] sm:max-w-3xl">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                        </Avatar>
                        <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-tl-none">
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

            {/* Input Form */}
            <div className="p-4 sm:p-6 border-t border-white/20 dark:border-gray-700/20">
              <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Ask a question about your document..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto"
                  disabled={isLoading || !inputValue.trim()}
                >
                  {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                  Send
                </Button>
              </form>
              <p className="text-xs mt-2 bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-400 dark:to-gray-200 bg-clip-text text-transparent">
                Ask questions like "Summarize this document" or "What does the diagram on page 5 represent?"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
