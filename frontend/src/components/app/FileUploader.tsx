import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '@/config/api';
import { Progress } from '@/components/ui/progress';

const FileUploader = ({ onUploadSuccess }: { onUploadSuccess?: () => void }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => 
      file.type === 'application/pdf' || 
      file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (validFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload PDF files only.",
      });
      return;
    }

    const file = validFiles[0]; // We'll handle one file at a time
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post(`${API_URL}/upload/pdfs`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.url) {
        toast({
          title: "Upload successful!",
          description: "Your PDF has been uploaded successfully.",
        });
        if (onUploadSuccess) onUploadSuccess();
        // You can handle the uploaded file URL here
        // console.log('Uploaded file URL:', response.data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? 'border-primary bg-white' : 'border-gray-300 dark:border-gray-700'
      }`}>
        <CardContent className="p-0">
          <div
            className="flex flex-col items-center justify-center p-12 text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="mb-4 text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-medium mb-2">
              {isDragging ? 'Drop your PDF here' : 'Upload your PDF document'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
              Drag and drop your PDF here, or click to browse
            </p>
            {isUploading ? (
              <div className="w-full max-w-xs">
                <Progress value={uploadProgress} className="mb-2" />
                <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
              </div>
            ) : (
              <Button onClick={triggerFileInput} variant="outline">
                Select PDF
              </Button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".pdf"
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FileUploader;
