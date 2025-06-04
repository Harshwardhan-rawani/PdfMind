import React from 'react';
import { useParams } from 'react-router-dom';

const Viewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">PDF Viewer</h1>
      <p className="text-gray-600 dark:text-gray-300">Viewing PDF document {id ? `with ID: ${id}` : ''}</p>
      {/* Add PDF rendering logic here */}
    </div>
  );
};

export default Viewer;
