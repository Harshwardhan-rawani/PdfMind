
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DocumentCard from './DocumentCard';
import { motion } from 'framer-motion';

// Mock data for recent documents
const mockDocuments = [
  {
    id: '1',
    title: 'Business Proposal Q2 2025',
    date: 'Apr 15, 2025',
    pages: 24,
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Technical Documentation',
    date: 'Apr 10, 2025',
    pages: 45,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Project Timeline',
    date: 'Apr 5, 2025',
    pages: 12,
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'Quarterly Financials',
    date: 'Mar 28, 2025',
    pages: 18,
    thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    title: 'Research Paper',
    date: 'Mar 22, 2025',
    pages: 32,
  },
  {
    id: '6',
    title: 'User Manual v2.0',
    date: 'Mar 15, 2025',
    pages: 64,
  },
];

const RecentDocuments = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recent Documents</h2>
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
      
      {viewType === 'grid' ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mockDocuments.map(doc => (
            <motion.div key={doc.id} variants={itemVariants}>
              <DocumentCard {...doc} />
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
          {mockDocuments.map(doc => (
            <motion.div 
              key={doc.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium truncate">{doc.title}</h3>
                <p className="text-sm text-gray-500">{doc.pages} pages • Uploaded {doc.date}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/viewer/${doc.id}`}>View</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/chat/${doc.id}`}>Chat</a>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {mockDocuments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No documents uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default RecentDocuments;
