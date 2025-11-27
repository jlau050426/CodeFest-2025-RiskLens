import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import "./fileUpload.css";
import ImageCapturePopup from "../webcam/imageCapture";

const AdvancedFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback((newFiles) => {
    const validFiles = Array.from(newFiles).filter((file) => {
      const validTypes = [
        // 'image/png',
        "application/pdf",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format`);
        return false;
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} is too large (max 10MB)`);
        return false;
      }

      return true;
    });

    setFiles((prev) => [
      ...prev,
      ...validFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: "pending", // pending, uploading, success, error
      })),
    ]);
  }, []);

  const handleFileSelect = (event) => {
    handleFiles(event.target.files);
  };

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragOver(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const uploadFile = async (fileItem) => {
    const formData = new FormData();
    formData.append("files", fileItem.file);
    console.log(formData);

    try {
      console.log("posting");
      const response = await axios.post(
        "http://127.0.0.1:8000/upload-customer-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFiles((prev) =>
              prev.map((f) => (f.id === fileItem.id ? { ...f, progress } : f))
            );
          },
        }
      );

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? { ...f, status: "success", url: response.data.url }
            : f
        )
      );
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileItem.id ? { ...f, status: "error" } : f))
      );
    }
  };

  const uploadAllFiles = async () => {

    setIsUploading(true);
    const pendingFiles = files.filter((f) => f.status === "pending");

    for (const fileItem of pendingFiles) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, status: "uploading" } : f
        )
      );
      await uploadFile(fileItem);
    }

    setIsUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // Handler for opening the modal
  const handleOpenModal = () => setIsModalOpen(true);

  // Handler for closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    uploadAllFiles();
  }

  // Handler for when an image is successfully captured and saved
  const handleImageCapture = (imageDataUrl) => {
    setCapturedImage(imageDataUrl);
    console.log("Image Captured:", imageDataUrl.substring(0, 50) + "..."); // Log a snippet
  };
  return (
    <div className="advanced-upload-container">
      <div
        className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <div className="drop-zone-content">
          <span className="upload-icon">📁</span>
          <h3>Drop files here or click to browse</h3>
          <p>Bank Statement, Income Statement, EPF Statement, Company Statement (PDF only)</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="files-list">
          <h4>Selected Files ({files.length})</h4>
          {files.map((fileItem) => (
            <div key={fileItem.id} className="file-item">
              <div className="file-info">
                <span className="file-name">{fileItem.file.name}</span>
                <span className="file-size">
                  {formatFileSize(fileItem.file.size)}
                </span>
              </div>

              <div className="file-status">
                {fileItem.status === "uploading" && (
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${fileItem.progress}%` }}
                    ></div>
                    <span>{fileItem.progress}%</span>
                  </div>
                )}

                {fileItem.status === "success" && (
                  <span className="status-success">✅ Uploaded</span>
                )}

                {fileItem.status === "error" && (
                  <span className="status-error">❌ Failed</span>
                )}

                {fileItem.status === "pending" && (
                  <span className="status-pending">⏳ Pending</span>
                )}
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFile(fileItem.id)}
                disabled={fileItem.status === "uploading"}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          className="upload-all-btn"
          onClick={handleOpenModal}
          disabled={
            isUploading ||
            files.every(
              (f) => f.status === "success" || f.status === "uploading"
            )
          }
        >
          {isUploading
            ? "Uploading..."
            : `Upload All (${files.filter((f) => f.status === "pending").length
            })`}
        </button>
      )}

      <ImageCapturePopup
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCapture={handleImageCapture}
      />
    </div>
  );
};

export default AdvancedFileUpload;
