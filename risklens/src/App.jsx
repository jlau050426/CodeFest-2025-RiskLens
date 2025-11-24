import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import './App.css';

// --- COMPONENT: ACTIVITY CAMERA (With "Activate" Button) ---
const ActivityCamera = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedTags, setDetectedTags] = useState([]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setAnalyzing(true);
    
    // Simulate Backend Computer Vision Analysis
    setTimeout(() => {
      setAnalyzing(false);
      const mockTags = ["Luxury Watch", "Designer Bag", "Coffee Shop"]; 
      setDetectedTags(mockTags);
      onCapture(imageSrc, mockTags);
    }, 1500);
  }, [webcamRef, onCapture]);

  const retake = () => {
    setImgSrc(null);
    setDetectedTags([]);
  };

  return (
    <div className="camera-box">
      {/* STATE 1: IDLE (Camera Closed) */}
      {!isCameraOpen && !imgSrc && (
        <div className="camera-placeholder">
          <div className="placeholder-icon">📷</div>
          <p>Verify your live activity</p>
          <button className="secondary-btn" onClick={() => setIsCameraOpen(true)}>
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
            <button className="secondary-btn cancel-btn" onClick={() => setIsCameraOpen(false)}>
              Cancel
            </button>
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
                  <span key={i} className="vision-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
          
          {!analyzing && (
            <button className="retake-link" onClick={retake}>Retake Photo</button>
          )}
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: PERSONALITY QUIZ MODAL ---
const PersonalityQuizModal = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  const handleQuizOption = (type) => {
    onComplete(type);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>🧠 Rapid Personality Assessment</h3>
        <p>How do you usually approach a high-stakes problem?</p>
        
        <div className="quiz-options">
          <button className="quiz-btn" onClick={() => handleQuizOption("INTJ")}>
            <strong>Analyze It:</strong> I break it down logically and plan a strategy.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ENTP")}>
            <strong>Debate It:</strong> I look for loopholes and brainstorm creative fixes.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ISFP")}>
            <strong>Feel It:</strong> I trust my gut instinct and values.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ESTP")}>
            <strong>Wing It:</strong> I dive in and fix things as I go.
          </button>
        </div>
        <button className="close-link" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

// --- PAGE 1: INPUT PAGE ---
const InputPage = ({ formData, setFormData, onAnalyze, loading }) => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoCaptured = (image, tags) => {
    setFormData(prev => ({
      ...prev,
      activityImage: image,
      activityTags: tags
    }));
  };

  return (
    <div className="page-container fade-in">
      <section className="card input-section center-card">
        <div className="card-header">
          <h2>📂 Data Ingestion</h2>
          <p>Complete the profile to generate a risk assessment.</p>
        </div>

        {/* 1. PDF Upload */}
        <div className="form-group">
          <label>Upload Bank Statements (PDF)</label>
          <div className="file-upload-box">
            <input type="file" accept=".pdf" />
            <span>📎 Drag & drop PDF here</span>
          </div>
        </div>

        {/* 2. Personality Test Button */}
        <div className="form-group">
          <label>Personality Profile (MBTI)</label>
          <div className="quiz-group">
            <input 
              type="text" 
              name="mbti"
              value={formData.mbti} 
              readOnly 
              placeholder="Result will appear here..." 
            />
            <button className="secondary-btn" onClick={() => setShowQuiz(true)}>
              ⚡ Take Test
            </button>
          </div>
        </div>

        {/* 3. Camera Activity Log */}
        <div className="form-group">
          <label>Live Activity Verification</label>
          <p className="helper-text">Take a photo of your current activity/spending.</p>
          <ActivityCamera onCapture={handlePhotoCaptured} />
        </div>

        {/* 4. Daily Log Text */}
        <div className="form-group">
          <label>Daily Activity Log (Text)</label>
          <textarea 
            name="dailyActivity" rows="2"
            value={formData.dailyActivity} onChange={handleInputChange} 
          />
        </div>

        {/* 5. Purpose */}
        <div className="form-group">
          <label>Loan Purpose</label>
          <textarea 
            name="essay" rows="4"
            value={formData.essay} onChange={handleInputChange} 
          />
        </div>

        <button className="analyze-btn" onClick={onAnalyze} disabled={loading}>
          {loading ? "🔄 Processing Vector DB..." : "🚀 Run Model"}
        </button>
      </section>

      <PersonalityQuizModal 
        isOpen={showQuiz} 
        onClose={() => setShowQuiz(false)} 
        onComplete={(result) => setFormData({...formData, mbti: result})} 
      />
    </div>
  );
};

// --- PAGE 2: RESULT PAGE ---
const ResultPage = ({ result, formData, onBack }) => {
  const personalityData = [
    { subject: 'Risk', A: 90, fullMark: 100 },
    { subject: 'Spending', A: 85, fullMark: 100 },
    { subject: 'Honesty', A: 40, fullMark: 100 },
    { subject: 'Stability', A: 30, fullMark: 100 },
    { subject: 'Logic', A: 80, fullMark: 100 },
  ];

  const renderHighlightedEssay = (text, riskyWords) => {
    if (!riskyWords) return <p>{text}</p>;
    return (
      <div className="essay-text">
        {text.split(" ").map((word, i) => {
          const clean = word.toLowerCase().replace(/[.,]/g, "");
          const isRisky = riskyWords.some(rw => clean.includes(rw));
          return isRisky ? <span key={i} className="highlight-danger">{word} </span> : <span key={i}>{word} </span>;
        })}
      </div>
    );
  };

  return (
    <div className="page-container fade-in">
      <button className="back-link" onClick={onBack}>← Back to Input</button>
      
      <section className="card result-section">
        <div className={`status-banner ${result.decision === "REJECT" ? "danger" : "success"}`}>
          <h1>{result.decision}</h1>
          <span className="decision-label">AI RECOMMENDED ACTION</span>
        </div>

        <div className="split-result">
          {/* Chart Section */}
          <div className="chart-container">
            <h3>🧠 {formData.mbti} Psychometric Profile</h3>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={personalityData}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="User" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Show Captured Image Summary */}
            {formData.activityTags.length > 0 && (
              <div className="vision-summary">
                 <small>📸 Vision Detected: {formData.activityTags.join(", ")}</small>
              </div>
            )}
          </div>

          {/* Metrics Section */}
          <div className="metrics-column">
            <div className="metric-box">
              <span className="label">Financial Score</span>
              <span className="value">{result.finance_score}</span>
            </div>
            <div className="metric-box">
              <span className="label">AI Risk Score</span>
              <span className="value text-red">{result.ai_risk_score}</span>
            </div>
          </div>
        </div>

        {/* Transparency Report */}
        <div className="transparency-box">
          <p><strong>⚠️ Risk Factors Detected:</strong></p>
          {renderHighlightedEssay(formData.essay, result.risky_words)}
        </div>
      </section>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [currentPage, setCurrentPage] = useState("input");
  const [formData, setFormData] = useState({
    mbti: "", 
    dailyActivity: "I shop at luxury stores on weekends.",
    essay: "I need quick cash to cover some losses from a high-stakes investment.",
    activityImage: null,
    activityTags: []
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeRisk = async () => {
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setResult({
        decision: "REJECT",
        finance_score: 85,
        ai_risk_score: 88,
        risky_words: ["high-stakes", "losses", "quick cash"]
      });
      setLoading(false);
      setCurrentPage("result");
    }, 1500);
  };

  return (
    <div className="app-wrapper">
      <header className="navbar">
        <div className="logo">🛡️ RiskLens <span className="logo-ai">System</span></div>
      </header>

      {currentPage === "input" ? (
        <InputPage 
          formData={formData} 
          setFormData={setFormData} 
          onAnalyze={analyzeRisk} 
          loading={loading} 
        />
      ) : (
        <ResultPage 
          result={result} 
          formData={formData} 
          onBack={() => setCurrentPage("input")} 
        />
      )}
    </div>
  );
}

export default App;