import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import '../CSS/dropZone.css';

function FileUploader({ handleFileChange }) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      console.log('Accepted Files:', acceptedFiles);
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
      handleFileChange(acceptedFiles)
    }
  });

  const removeFile = (file) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file));
  };

  return (
    <div className='dropzone-container'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>+</p>
      </div>
      <ul className='image-list'>
        {files.map((file, index) => (
          <li key={index} className="image-item-container">
            <img src={URL.createObjectURL(file)} className="image-items" alt="select" />
            <button className="remove-button" onClick={() => removeFile(file)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileUploader;
