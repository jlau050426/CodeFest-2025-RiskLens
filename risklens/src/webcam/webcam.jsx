//useState: for remembering state in functional componentss
//useRef: to reference DOM elements or persist values across renders
//useCallback: to memoize functions and prevent unnecessary re-creations 


import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import "./webcam.css";

// --- COMPONENT: ACTIVITY CAMERA (With "Activate" Button) ---
const ActivityCamera = ({ onCapture }) => {
  const webcamRef = useRef(null); //create reference to webcam component
  const [isCameraOpen, setIsCameraOpen] = useState(false); //initial camera state
  const [imgSrc, setImgSrc] = useState(null); //captured image source
  const [analyzing, setAnalyzing] = useState(false); //analysis state
  const [detectedTags, setDetectedTags] = useState([]); //detected tags from analysis

  //Function to capture image from webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot(); //imageSource will be taken from screenshots
    setImgSrc(imageSrc);
    setAnalyzing(true);

    // Simulate Backend Computer Vision Analysis
    setTimeout(() => {
      setAnalyzing(false);
      const mockTags = ["Luxury Watch", "Designer Bag", "Coffee Shop"]; //hard coded results
      setDetectedTags(mockTags);
      onCapture(imageSrc, mockTags);
    }, 1500); // the processing delay is fake with approximately 1.5 seconds
  }, [webcamRef, onCapture]);


  //Function to retake photo
  const retake = () => {
    setImgSrc(null);
    setDetectedTags([]);
  };

  return (
    <div className="camera-box">
      {/* STATE 1: IDLE (Camera Closed) */}
      {!isCameraOpen && !imgSrc && (
        <div className="camera-placeholder">
          <p>Verify your live activity</p>
          <button
            className="secondary-btn"
            onClick={() => setIsCameraOpen(true)}
          >
            Activate Camera
          </button>
        </div>
      )}

      {/* STATE 2: STREAMING (Camera Open) */}
      {isCameraOpen && !imgSrc && (
        <>
          <div className="video-wrapper">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-feed"
            />
            <div className="scan-line"></div>
          </div>
          <div className="camera-controls">
            <button className="secondary-btn snap-btn" onClick={capture}>
              📸 Snap Activity
            </button>
          </div>
        </>
      )}

      {/* STATE 3: RESULT (Photo Taken) */}
      {imgSrc && (
        <div className="photo-preview">
          <img src={imgSrc} alt="captured" className="captured-img" />

          {analyzing ? (
            <div className="analyzing-overlay">🔍 AI Vision Processing...</div>
          ) : (
            <div className="vision-results">
              <span className="vision-label">AI OBJECT DETECTION:</span>
              <div className="tags-container">
                {detectedTags.map((tag, i) => (
                  <span key={i} className="vision-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!analyzing && (

            <button className="retake-link" onClick={retake}>
              Retake Photo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityCamera;