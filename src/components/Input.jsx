import React, { useState } from 'react';
import Attach from '../img/attach.png';
import CryptoJS from 'crypto-js';
import Img from '../img/img.png';

const SECRET_PASS = "XkhZG4fW2t2W"; // Keep your secret pass safe!

const Input = ({ inputValue, setInputValue, onSend }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    console.log('Selected file:', selectedFile);
  };


  const encryptFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        // Encrypting the file data
        const encrypted = CryptoJS.AES.encrypt(fileData, SECRET_PASS).toString();
        // Convert encrypted string back to Blob
        const encryptedBlob = new Blob([encrypted], { type: file.type });
        resolve(encryptedBlob);
      };
      reader.readAsBinaryString(file); // Read the file as binary string
    });
  };

  const uploadFile = async () => {
    if (file) {
      const encryptedFile = await encryptFile(file);
      const formData = new FormData();
      //formData.append('file', file);
      formData.append('file', encryptedFile, file.name);

      try {
        const response = await fetch('https://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response data:', errorData);
          throw new Error(errorData.error || 'Error uploading file');
        }
        
        const data = await response.json();
        const fileURL = data.filePath;
        console.log(fileURL)

        console.log('Uploaded file URL:', fileURL);

        // Clear the file input
        setFile(null);
        return fileURL;
      } catch (error) {
        console.error('Error uploading file:', error);
        return null;
      }
    }
    return null;
  };

  const handleSend = async () => {
    const fileURL = await uploadFile();
    console.log('Sending message with text:', inputValue, 'and file URL:', fileURL);
    onSend(inputValue, fileURL);
    setInputValue('');
  };

  return (
    <div className='input'>
      <input
        type="text"
        placeholder='Type something....'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className='send'>
        <img src={Attach} alt="" />
        <input type="file" style={{ display: "none" }} id="file" onChange={handleFileChange} />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
