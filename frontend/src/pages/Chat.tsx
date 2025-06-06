import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppHeader from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { BiSolidFoodMenu } from "react-icons/bi";
import { Document, Page, pdfjs } from 'react-pdf';
import { API_URL } from '@/config/api';
import { HiMenu } from 'react-icons/hi';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [recentChats, setRecentChats] = useState<Array<{ id: string; title: string; date: string }>>([
    { id: '1', title: 'Summary of Q2 Report', date: '2025-06-01' },
    { id: '2', title: 'Diagram on Page 5', date: '2025-05-28' },
    { id: '3', title: 'Financial Growth', date: '2025-05-20' },
  ]);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch PDF info for the document
    const fetchPdfInfo = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${API_URL}/upload/pdf/${id}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch PDF info');
        const data = await res.json();
        console.log(data)
        setPdfUrl(data.url);
        setNumPages(data.pages || 0);
      } catch {
        setPdfUrl(null);
      }
    };
    fetchPdfInfo();
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setTimeout(() => {
      const responses = [
        "Based on your document, I found that the key information is in section 3.2 on page 12.",
        "The diagram on page 8 shows a correlation between the variables you're asking about.",
        "According to your document, the main conclusions are outlined in the executive summary.",
        "I've found several references to that topic in your document. Would you like me to summarize them?",
        "The financial projections in your document indicate a 15% growth rate over the next quarter.",
      ];
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
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
      <AppHeader />
      <main className="flex flex-1 w-full max-w-full px-2 py-4 flex-col lg:flex-row gap-6">
        {/* Sidebar for mobile */}
        {showSidebar && (
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setShowSidebar(false)} />
        )}
        <aside className={`fixed z-50 top-0 left-0 lg:h-[85vh] h-screen w-64 bg-white dark:bg-gray-900 shadow-lg transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 lg:static lg:translate-x-0 lg:w-1/4 flex flex-col gap-6 min-w-[260px] max-w-full`}> 
          <div className="p-4 flex flex-col h-[22vh] min-h-[180px]">
         
            <div className="flex flex-col items-center gap-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="font-medium text-base break-all text-center" title={pdfUrl ? pdfUrl.split('/').pop() : 'No PDF'}>
                {pdfUrl ? decodeURIComponent(pdfUrl.split('/').pop() || 'PDF Document') : 'No PDF'}
              </span>
              <span className="text-xs text-gray-500">{numPages} page{numPages === 1 ? '' : 's'}</span>
            </div>
    
         
          </div>
          <div className="p-4 flex-1 overflow-auto min-h-[180px]">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2" /></svg>
              Recent Chats
            </h2>
            <ul className="space-y-2">
              {recentChats.map(chat => (
                <li key={chat.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 cursor-pointer transition">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-white">C</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium truncate text-sm">{chat.title}</span>
                    <span className="block text-xs text-gray-400">{chat.date}</span>
                  </div>
              
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Right Side: Chatbot */}
        <div className="w-full lg:w-3/4 flex flex-col h-[85vh] bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 max-w-full overflow-hidden">
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Hamburger for mobile */}
        <div className='flex gap-3 items-center'>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
            </Avatar>
            <h1 className="text-xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Chat with Document</h1>
               </div>
                <div className="lg:hidden mr-2">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowSidebar(s => !s)}
              >
                <span className="sr-only">Open sidebar</span>
                <BiSolidFoodMenu className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 max-h-[calc(90vh-120px)]">
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
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 mt-2">
            <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-2 items-end relative">
              <div className="relative flex-1 w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12A4 4 0 118 12a4 4 0 018 0z" /></svg>
                </span>
                <Input
                  placeholder="Ask a question about your document..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-10 pr-10 flex-1 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-full focus:ring-2 focus:ring-primary/40 transition"
                  disabled={isLoading}
                />
                {inputValue && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    onClick={() => setInputValue('')}
                    tabIndex={-1}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              <Button 
                type="submit" 
                className="bg-black hover:opacity-90 w-full sm:w-auto flex items-center gap-1 rounded-full px-5 py-2 min-h-[40px]"
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                <svg className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="inline">Send</span>
              </Button>
            </form>
         
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
