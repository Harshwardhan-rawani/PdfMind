import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppHeader from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { GoDotFill } from "react-icons/go";
const API_URL = import.meta.env.VITE_API_URL;

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const [pdfInfo, setPdfInfo] = useState<{ title: string; pages: number; url : string; created_at: string; bytes: number } | null>(null);
  const [pdfInfoLoading, setPdfInfoLoading] = useState(true);
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  
    const fetchPdfInfo = async () => {
      setPdfInfoLoading(true);
      try {
        const res = await axios.get(`${API_URL}/upload/pdf/${id}`, { withCredentials: true });
        setPdfInfo(res.data);
        console.log('PDF Info:', res.data);

      } catch (err) {
        setPdfInfo(null);
      } finally {
        setPdfInfoLoading(false);
      }
    };
    fetchPdfInfo();
  },[id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send question, pdfId, and pdfUrl to backend
      const res = await axios.post(`${API_URL}/chat/ask`, {
        pdfId: id,
        pdfUrl: pdfInfo?.url,
        question: inputValue,
      }, { withCredentials: true });
      const aiResponse = {
        id: `ai-${Date.now()}`,
        content: res.data.answer || 'No answer received.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          content: 'Sorry, there was an error getting a response from the chatbot.',
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen min-h-screen bg-white dark:bg-zinc-900 flex flex-col overflow-hidden">
      <AppHeader />
      {pdfInfoLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="w-10 h-10 text-primary" />
        </div>
      ) : (
        <main className="flex-1 px-2 sm:px-4 py-4 sm:py-6 flex flex-col sm:flex-row gap-4 sm:gap-6 overflow-hidden">
          {/* Hamburger for mobile */}
          <button
            className="sm:hidden fixed top-13 left-4 z-30 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full p-2 shadow-lg"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700 dark:text-gray-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
          {/* PDF Info Sidebar with Prompt History */}
          <div
            className={`sm:w-1/5 w-4/5 max-w-xs overflow-y-scroll fixed inset-y-0 left-0 z-40 bg-white dark:bg-zinc-800 rounded-r-xl shadow-lg p-6 border border-gray-200 dark:border-zinc-700 transform transition-transform duration-300 sm:relative sm:max-w-none sm:inset-y-auto sm:left-auto sm:z-0 sm:rounded-xl sm:shadow-lg sm:p-6 sm:border sm:border-gray-200 dark:sm:border-zinc-700
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
            style={{ minWidth: '220px', height: '100vh', ...(window.innerWidth >= 640 ? { height: '85vh' } : {}) }}
          >
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-zinc-700 rounded-full mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center truncate max-w-[180px]" title={pdfInfo?.title}>{pdfInfo?.title || 'Document'}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pdfInfo ? `${pdfInfo.pages} page${pdfInfo.pages === 1 ? '' : 's'}` : '-'}</p>
            </div>
            {/* Prompt History */}
            <div className="w-full mt-6 flex-1 flex flex-col">
              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">History</h3>
              <ul className="space-y-2 max-h-60 sm:max-h-[calc(100vh-220px)] overflow-y-auto pr-1 flex-1">
                {messages.filter(m => m.isUser).map((m, idx) => (
                  <li key={m.id} className="font-thin text-sm italic text-gray-700 dark:text-gray-200  rounded px-3 py-2 cursor-pointer flex items-center hover:bg-gray-200 dark:hover:bg-zinc-600 truncate" title={m.content}>
                    {m.content.length > 40 ? m.content.slice(0, 40) + '...' : m.content}
                  </li>
                ))}
                {messages.filter(m => m.isUser).length === 0 && (
                  <li className="text-xs text-gray-400 dark:text-gray-500">No prompts yet</li>
                )}
              </ul>
            </div>
            {/* Close button for mobile */}
            <button
              className="sm:hidden absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden dark:bg-black dark:bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            />
          )}
          {/* Chatbot Area */}
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 mt-4 sm:mt-0 overflow-hidden">
            {/* Chat Header */}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-full min-h-0">
              <div className="space-y-4 min-w-0 max-w-full overflow-x-auto">
                <AnimatePresence>
                  {messages.length === 1 && !messages[0].isUser ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                      <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-red-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h2 className="text-lg font-semibold mb-2 text-green-500">Ask questions about your document</h2>
                        <p className="text-sm">Type your prompt below to get started!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start max-w-[85%] sm:max-w-3xl ${message.isUser ? 'flex-row-reverse' : ''} w-full`}>
                          {!message.isUser && (
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
                              message.isUser
                                ? 'bg-primary/80 backdrop-blur-sm text-white rounded-tr-none ml-3'
                                : 'bg-gray-100/80 dark:bg-zinc-700/80 backdrop-blur-sm rounded-tl-none'
                            } max-w-full overflow-x-auto inline-block min-w-0`}
                          >
                            <p className={`break-words ${!message.isUser ? 'text-gray-900 dark:text-gray-100' : ''}`}>{message.content}</p>
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
                    ))
                  )}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start max-w-[85%] sm:max-w-3xl w-full">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                        </Avatar>
                        <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-100/80 dark:bg-zinc-700/80 backdrop-blur-sm rounded-tl-none max-w-full overflow-x-auto inline-block min-w-0">
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
            <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80">
              <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Ask a question about your document..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-white/50 dark:bg-zinc-800/60 backdrop-blur-sm rounded-full text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400 border border-gray-200 dark:border-zinc-700"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-primary hover:opacity-90 w-full rounded-full sm:w-auto"
                  disabled={isLoading || !inputValue.trim()}
                >
                  {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                  Send
                </Button>
              </form>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Chat;
