import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { Button } from '@/components/ui/button';
import DocumentCard from './DocumentCard';
import { motion } from 'framer-motion';
import FileUploader from './FileUploader';
import { useToast } from '@/components/ui/use-toast';

type Document = {
  _id: string;
  title: string;
  url: string;
  public_id: string;
  bytes?: number;
  created_at?: string;
  pages?: number;
};

const RecentDocuments = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/upload/pdfs`, { withCredentials: true });
      setDocuments(res.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // Listen for rename events to update document title in state
    const handleRenameEvent = (e: CustomEvent<{ id: string; newTitle: string }>) => {
      const { id, newTitle } = e.detail || {};
      setDocuments(prevDocs => prevDocs.map(doc => doc._id === id ? { ...doc, title: newTitle } : doc));
    };
    window.addEventListener('pdf-renamed', handleRenameEvent as EventListener);
    return () => window.removeEventListener('pdf-renamed', handleRenameEvent as EventListener);
  }, []);

  const handleUploadSuccess = () => {
    fetchDocuments();
  };

  const handleDelete = async (id: string) => {
    // Optimistically remove the document
    const prevDocs = documents;
    setDocuments(documents.filter(doc => doc._id !== id));
    try {
      await axios.delete(`${API_URL}/upload/pdfs/${id}`, { withCredentials: true });
      toast({
        title: 'Document deleted',
        description: 'The document was deleted successfully.',
      });
    } catch (err) {
      setDocuments(prevDocs); // Rollback on error
      setError('Failed to delete document');
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: 'There was an error deleting the document.',
      });
    }
  };



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <div>
      <FileUploader onUploadSuccess={handleUploadSuccess} />
      <br />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recent Documents</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">PDFs: {documents.length}</span>
          <div className="flex space-x-2">
            <Button
              variant={viewType === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('grid')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('list')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Loading documents...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No documents uploaded yet</p>
        </div>
      ) : viewType === 'grid' ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {documents.map(doc => (
            <motion.div key={doc._id} variants={itemVariants}>
              <DocumentCard 
                id={doc._id}
                title={doc.title}
                date={doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ''}
                pages={doc.pages}
                thumbnail={undefined}
                onDelete={handleDelete}
                variant="grid"
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {documents.map(doc => (
            <motion.div key={doc._id} variants={itemVariants}>
              <DocumentCard 
                id={doc._id}
                title={doc.title}
                date={doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ''}
                pages={doc.pages}
                thumbnail={undefined}
                onDelete={handleDelete}
                variant="list"
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RecentDocuments;
