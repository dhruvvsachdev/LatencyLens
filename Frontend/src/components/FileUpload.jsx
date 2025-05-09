import React, { useState } from 'react';

const FileUpload = ({ onGraphDataFetched }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const handleFileChange = (e) => {
  const uploadedFile = e.target.files[0];
  if (uploadedFile && uploadedFile.name.toLowerCase().endsWith('.npz')) {
    setFile(uploadedFile);
    setError(null);
  } else {
    setFile(null);
    setError('Please upload a valid .npz file');
  }
};



  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      onGraphDataFetched(data); // Pass the graph data to the parent component (to visualize)
      setFile(null); // Reset the file input
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <input
  type="file"
  accept=".npz"
  onChange={handleFileChange}
  disabled={loading}
/>

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="upload-button"
      >
        {loading ? 'Uploading...' : 'Upload File'}
      </button>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FileUpload;  
