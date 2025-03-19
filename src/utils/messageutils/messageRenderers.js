export const renderMessageFile = (fileURL) => {
    const fileExtension = fileURL.split('.').pop().toLowerCase();
    const filename = fileURL.split('/').pop();
  
    const handleDownload = () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `http://localhost:5000/uploads/${filename}`, true);
      xhr.responseType = 'blob';
  
      xhr.onload = function () {
        if (this.status === 200) {
          const encryptedBlob = this.response;
          const reader = new FileReader();
          reader.onload = function (event) {
            const encryptedData = event.target.result;
            const decryptedData = CryptoJS.AES.decrypt(encryptedData, SECRET_PASS).toString(CryptoJS.enc.Utf8);
            const decryptedBlob = new Blob([decryptedData], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(decryptedBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          };
          reader.readAsText(encryptedBlob);
        } else {
          console.error('Error downloading file:', this.statusText);
        }
      };
  
      xhr.onerror = function () {
        console.error('Request failed with status:', this.status);
      };
  
      xhr.send();
    };
  
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return (
        <div>
          <img src={fileURL} alt="file" />
          <button onClick={handleDownload}>Download Image</button>
        </div>
      );
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(fileExtension)) {
      return <button onClick={handleDownload}>Download Document</button>;
    } else if (['mp3', 'wav'].includes(fileExtension)) {
      return (
        <div>
          <audio controls src={fileURL} />
          <button onClick={handleDownload}>Download Audio</button>
        </div>
      );
    } else if (['mp4'].includes(fileExtension)) {
      return (
        <div>
          <video controls src={fileURL} />
          <button onClick={handleDownload}>Download Video</button>
        </div>
      );
    } else {
      return <button onClick={handleDownload}>Download File</button>;
    }
  };
  
  export const formatMessageTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };