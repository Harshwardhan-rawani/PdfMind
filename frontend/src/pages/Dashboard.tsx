
import AppHeader from '@/components/app/AppHeader';
import FileUploader from '@/components/app/FileUploader';
import RecentDocuments from '@/components/app/RecentDocuments';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AppHeader />
      <motion.main 
        className="container mx-auto px-4 py-8 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <section className="mb-12">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Welcome to your dashboard! Here you can upload new documents and view your recent uploads.</p>
          </section>
          
          <section>
            <RecentDocuments />
          </section>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;
