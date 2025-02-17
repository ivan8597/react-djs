import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ onAnalysisComplete }) {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/analyze', formData);
      onAnalysisComplete(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      alert('Произошла ошибка при анализе файла');
    }
    setLoading(false);
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && <p>Выполняется анализ...</p>}
    </div>
  );
}

export default FileUpload; 