// src/components/FileUploader.js
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        alert('Please select a file first.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      //   alert('File uploaded successfully!');
      if (inputRef.current && inputRef.current.value) {
        inputRef.current.value = '';
      }
      setUploadProgress(0); // Reset progress after successful upload
      setUploadComplete(true); // Set upload complete flag
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed. Please try again.');
      setUploadProgress(0); // Reset progress after failed upload
      setUploadComplete(false); // Reset upload complete flag
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>File Uploader</h2>
      <div style={styles.fileInputContainer}>
        <input type="file" onChange={handleFileChange} ref={inputRef} style={styles.fileInput} />
        <button onClick={handleUpload} style={styles.uploadButton}>
          Upload
        </button>
      </div>

      {uploadProgress > 0 && !uploadComplete && (
        <div style={styles.progressBarContainer}>
          <p style={styles.progressBarText}>Uploading: {uploadProgress}%</p>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }}></div>
          </div>
        </div>
      )}

      {uploadComplete && (
        <div style={styles.checkmarkContainer}>
          <div style={styles.checkmarkWrapper}>
            <FontAwesomeIcon icon={faCheck} style={styles.checkmark} />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  fileInputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  fileInput: {
    marginRight: '10px',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  uploadButton: {
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    background: '#4caf50',
    color: '#fff',
    cursor: 'pointer',
  },
  progressBarContainer: {
    marginTop: '20px',
  },
  progressBarText: {
    marginBottom: '10px',
  },
  progressBar: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    height: '20px',
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    background: '#4caf50',
    borderRadius: '5px',
    height: '100%',
    transition: 'width 0.3s ease-in-out',
  },
  checkmarkContainer: {
    marginTop: '20px',
  },
  checkmarkWrapper: {
    position: 'relative',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#4caf50',
    display: 'inline-block',
    animation: 'dash 1.5s ease-in-out forwards, fade 1.5s ease-in-out forwards',
  },
  checkmark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
    fontSize: '20px',
  },
  '@keyframes dash': {
    '0%': { backgroundSize: '200% 100%' },
    '100%': { backgroundSize: '200% 100%' },
  },
  '@keyframes fade': {
    '0%': { opacity: 0 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0 },
  },
};

export default FileUploader;
