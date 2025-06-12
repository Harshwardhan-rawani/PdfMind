import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { API_URL } from '@/config/api';

interface DocumentCardProps {
  id: string;
  title: string;
  date: string;
  pages: number;
  thumbnail?: string;
  onDelete?: (id: string) => void;
  variant?: 'grid' | 'list'; // Add variant prop
}

const DocumentCard = ({ id, title, date, pages, thumbnail, onDelete, variant = 'grid' }: DocumentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [renameLoading, setRenameLoading] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);

  const handleRename = async () => {
    setRenameLoading(true);
    setRenameError(null);
    try {
      await axios.put(`${API_URL}/upload/pdfs/${id}/rename`, { title: newTitle }, { withCredentials: true });
      setIsRenaming(false);
      // Instead of window.location.reload(), update the title in parent state via callback if provided
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('pdf-renamed', { detail: { id, newTitle } }));
      }
    } catch (err) {
      setRenameError('Failed to rename document');
    } finally {
      setRenameLoading(false);
    }
  };

  if (variant === 'list') {
    // Compact row for list view, whole row clickable for chat, dropdown for actions
    return (
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition" onClick={() => window.location.href = `/chat/${id}`}> 
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base truncate" title={title}>{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{pages} page{pages === 1 ? '' : 's'}</p>
        </div>
        <div className="flex items-center space-x-2 ml-2" onClick={e => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <span className="w-full flex items-center cursor-pointer" onClick={() => window.location.href = `/chat/${id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  Chat
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button className="w-full flex items-center" onClick={() => setIsRenaming(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Rename
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <button className="w-full flex items-center" onClick={() => onDelete && onDelete(id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layoutId={`doc-${id}`}
    >
      <Card className="overflow-hidden h-full border-gray-200 dark:border-gray-800 transition-shadow hover:shadow-md">
        <Link to={`/chat/${id}`}>
          <div className="relative pt-[65%] bg-gray-100 dark:bg-gray-800">
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            )}
            
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
              >
                <span className="text-white dark:text-black font-medium px-3 py-1.5 rounded-full bg-primary/90">
                  Chat
                </span>
              </motion.div>
            )}
          </div>
        </Link>
        
        <CardContent className="pt-4">
          <div className="flex justify-between items-start">
            <div className="truncate pr-2">
              {isRenaming ? (
                <div className="flex flex-col gap-2">
                  <Input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="text-lg font-medium"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      className="text-primary font-medium text-sm"
                      onClick={handleRename}
                      disabled={renameLoading || !newTitle.trim()}
                    >
                      {renameLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      className="text-gray-500 text-sm"
                      onClick={() => { setIsRenaming(false); setNewTitle(title); }}
                      disabled={renameLoading}
                    >
                      Cancel
                    </button>
                  </div>
                  {renameError && <span className="text-xs text-red-500">{renameError}</span>}
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-lg truncate" title={title}>{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{pages} page{pages === 1 ? '' : 's'}</p>
                </>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to={`/chat/${id}`} className="w-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    Chat
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button className="w-full flex items-center" onClick={() => setIsRenaming(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Rename
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <button className="w-full flex items-center" onClick={() => onDelete && onDelete(id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Delete
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 px-6">
          <div className="w-full flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Uploaded {date}</span>
        
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DocumentCard;
