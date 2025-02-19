import React, { useState } from 'react';
import axios from 'axios';

interface FileUploadProps {
  onAnalysisComplete: (result: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete }) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData);
      onAnalysisComplete(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && <p>Uploading...</p>}
    </div>
  );
};

export default FileUpload; 