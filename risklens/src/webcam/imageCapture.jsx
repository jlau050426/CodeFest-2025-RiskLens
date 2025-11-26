import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios'; 

const API_ENDPOINT = 'http://127.0.0.1:8000/upload-customer-image';

const videoConstraints = {
  width: 720,
  height: 540,
  facingMode: 'user', 
};

// Removed the 'onCapture' prop as the upload is now internal to this component
const ImageCapturePopup = ({ isOpen, onClose }) => { 
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(''); // State to show upload status

  // Function to capture the image (remains the same)
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: videoConstraints.width,
      height: videoConstraints.height,
    });
    setImgSrc(imageSrc);
    setUploadStatus(''); // Clear status on retake
  }, [webcamRef, setImgSrc]);

  // Function to convert Data URL to a File object
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    // The format is image/png;base64,.....
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return new File([], filename); 
    const mime = mimeMatch[1];
    
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
  };

  // Function to save and upload the captured image
  const handleSave = async () => {
    if (!imgSrc) return;

    setUploadStatus('Uploading...');
    
    try {
      // 1. Convert the Data URL (PNG) to a File object
      const file = dataURLtoFile(imgSrc, `webcam-capture-${Date.now()}.png`);

      // 2. Create FormData
      const formData = new FormData();
      // Append the file. 'file' should match the field name your API expects.
      formData.append('file', file); 
      // You can add other data like user ID: formData.append('userId', '123');

      // 3. Send the file using Axios
      const response = await axios.post(API_ENDPOINT, formData, {
        headers: {
          // Setting 'Content-Type': 'multipart/form-data' is often automatic
          // when using FormData, but sometimes useful for clarity.
          'Content-Type': 'multipart/form-data' 
        }
      });
      
      console.log('Upload successful!', response.data);
      setUploadStatus('Upload Success! ✅');

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('Upload Failed! ❌');
    } finally {
      // Reset component state and close modal after upload attempt (success or fail)
      setImgSrc(null); 
      onClose(); // Close the modal
    }
  };

  // Function to retake the image
  const handleRetake = () => {
    setImgSrc(null);
    setUploadStatus('');
  };

  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop overlay and modal structure (Tailwind styles remain the same)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      
      <div className="relative p-6 bg-white rounded-lg shadow-xl max-w-lg w-full m-4">
        
        <h2 className="text-xl font-bold mb-4 text-gray-800">📸 Capture & Upload Image</h2>
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-150"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Webcam or Image Preview Area */}
        <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
          {imgSrc ? (
            <img 
              src={imgSrc} 
              alt="Captured" 
              className="w-full h-auto object-cover" 
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png" // Ensures PNG format
              videoConstraints={videoConstraints}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Upload Status */}
        {uploadStatus && (
            <div className={`p-2 mb-3 text-sm rounded ${uploadStatus.includes('Success') ? 'bg-green-100 text-green-700' : uploadStatus.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {uploadStatus}
            </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          {imgSrc ? (
            <>
              <button
                onClick={handleRetake}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
              >
                Retake
              </button>
              <button
                onClick={handleSave}
                // Disable button during upload
                disabled={uploadStatus.includes('Uploading')} 
                className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition duration-150 ${uploadStatus.includes('Uploading') ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {uploadStatus.includes('Uploading') ? 'Uploading...' : 'Save & Upload'}
              </button>
            </>
          ) : (
            <button
              onClick={capture}
              className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150"
            >
              Capture Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCapturePopup;