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

  return (
    <div className='dropzone-container'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>+</p>
      </div>
      <ul className='image-list'>
        {files.map((file, index) => (
          <img src={URL.createObjectURL(file)} key={index} className="image-items" alt="select" />
        ))}
      </ul>
    </div>
  );
}

export default FileUploader;