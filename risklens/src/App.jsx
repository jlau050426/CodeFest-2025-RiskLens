import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  PieChart, Pie, Cell,
  ResponsiveContainer 
} from 'recharts';
import './App.css';

// --- COMPONENT: ACTIVITY CAMERA ---
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
    
    setTimeout(() => {
      setAnalyzing(false);
      const mockTags = ["Human Face", "Indoor Environment", "Liveness Confirmed"]; 
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
      {!isCameraOpen && !imgSrc && (
        <div className="camera-placeholder">
          <div className="placeholder-icon">📸</div>
          <p>Live Identity Verification</p>
          <button className="secondary-btn" onClick={() => setIsCameraOpen(true)}>
            Activate Camera
          </button>
        </div>
      )}

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
            <button className="secondary-btn cancel-btn" onClick={() => setIsCameraOpen(false)}>Cancel</button>
            <button className="secondary-btn snap-btn" onClick={capture}>Capture</button>
          </div>
        </>
      )}

      {imgSrc && (
        <div className="photo-preview">
          <img src={imgSrc} alt="captured" className="captured-img" />
          {analyzing ? (
            <div className="analyzing-overlay">🔍 Verifying Liveness...</div>
          ) : (
            <div className="vision-results">
              <span className="vision-label">AI DETECTED:</span>
              <div className="tags-container">
                {detectedTags.map((tag, i) => <span key={i} className="vision-tag">{tag}</span>)}
              </div>
            </div>
          )}
          {!analyzing && <button className="retake-link" onClick={retake}>Retake Photo</button>}
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
        <h3>🧠 Character Assessment</h3>
        <p>If you encountered an unexpected financial loss, what is your first reaction?</p>
        <div className="quiz-options">
          <button className="quiz-btn" onClick={() => handleQuizOption("INTJ")}>
            <strong>Strategize:</strong> Immediate budget cut and debt restructuring.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ENTP")}>
            <strong>Innovate:</strong> Find a new high-risk, high-reward income source.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ISFP")}>
            <strong>Adapt:</strong> Sell assets and live minimally until recovered.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ESTP")}>
            <strong>Action:</strong> Work overtime or second job immediately.
          </button>
        </div>
        <button className="close-link" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

// --- WIZARD STEP 1: PERSONAL INFO (NEW) ---
const StepPersonal = ({ formData, handleChange }) => (
  <div className="fade-in">
    <div className="form-row">
      <div className="form-group">
        <label>Full Name (As per ID)</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. John Doe" />
      </div>
      <div className="form-group">
        <label>NRIC / Passport No.</label>
        <input type="text" name="nric" value={formData.nric} onChange={handleChange} placeholder="e.g. 901010-10-1234" />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Phone Number</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
    </div>

    <div className="form-group">
      <label>Permanent Address</label>
      <textarea name="permAddress" rows="2" value={formData.permAddress} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Current Address</label>
      <textarea name="currAddress" rows="2" value={formData.currAddress} onChange={handleChange} placeholder="If different from above" />
    </div>

    <div className="form-row three-col">
      <div className="form-group">
        <label>Age</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Marital Status</label>
        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>
      <div className="form-group">
        <label>Dependents</label>
        <input type="number" name="dependents" value={formData.dependents} onChange={handleChange} />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Length of Residence (Years)</label>
        <input type="number" name="residenceLength" value={formData.residenceLength} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Employment Status</label>
        <select name="employment" value={formData.employment} onChange={handleChange}>
          <option value="Employed">Employed</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Unemployed">Unemployed</option>
        </select>
      </div>
    </div>
  </div>
);

// --- WIZARD STEP 2: FINANCIAL ---
const StepFinancial = ({ formData, handleChange }) => (
  <div className="fade-in">
    <div className="form-group">
      <label>Annual Gross Income ($)</label>
      <input type="number" name="salary" value={formData.salary} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Total Monthly Debt / Housing ($)</label>
      <input type="number" name="debt" value={formData.debt} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Credit Score (Estimate)</label>
      <input type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Employer / Business Name</label>
      <input type="text" name="employerName" value={formData.employerName} onChange={handleChange} placeholder="Company Name" />
    </div>
  </div>
);

// --- WIZARD STEP 3: VERIFICATION ---
const StepVerification = ({ formData, handleFileChange, handlePhotoCaptured }) => (
  <div className="fade-in">
    <div className="form-group">
      <label>Proof of Income (Bank Statement PDF)</label>
      <div className="file-upload-box">
        <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'bankStatement')} />
        <span>{formData.bankStatement ? `📄 ${formData.bankStatement.name}` : "📎 Drag & drop PDF here"}</span>
      </div>
    </div>
    <div className="form-group">
      <label>Latest Transaction Record (Image)</label>
      <div className="file-upload-box">
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'transactionImg')} />
        <span>{formData.transactionImg ? `🖼️ ${formData.transactionImg.name}` : "📎 Upload Transaction Screenshot"}</span>
      </div>
    </div>
    <div className="form-group">
      <label>Liveness Check (Robot Detection)</label>
      <ActivityCamera onCapture={handlePhotoCaptured} />
    </div>
  </div>
);

// --- WIZARD STEP 4: BEHAVIORAL ---
const StepBehavioral = ({ formData, handleChange, openQuiz }) => (
  <div className="fade-in">
    <div className="form-group">
      <label>Personality Profile (MBTI)</label>
      <div className="quiz-group">
        <input type="text" value={formData.mbti} readOnly placeholder="Pending Assessment..." />
        <button className="secondary-btn" onClick={openQuiz}>⚡ Start Test</button>
      </div>
    </div>
    <div className="form-group">
      <label>Statement of Purpose (Loan Essay)</label>
      <textarea 
        name="essay" 
        rows="6" 
        value={formData.essay} 
        onChange={handleChange}
        placeholder="Explain why you need this loan and how you plan to repay it..." 
      />
    </div>
  </div>
);

// --- PAGE: INPUT WIZARD CONTAINER ---
const InputPage = ({ formData, setFormData, onAnalyze, loading }) => {
  const [step, setStep] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const TOTAL_STEPS = 4;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

  const handlePhotoCaptured = (image, tags) => {
    setFormData(prev => ({ ...prev, activityImage: image, activityTags: tags }));
  };

  return (
    <div className="page-container">
      <section className="card input-section center-card">
        <div className="card-header">
          <div className="step-indicator">STEP {step} OF {TOTAL_STEPS}</div>
          <h2>
            {step === 1 && "👤 Personal Information"}
            {step === 2 && "💰 Financial Profile"}
            {step === 3 && "🔐 Verification"}
            {step === 4 && "🧠 Behavioral Analysis"}
          </h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}></div>
          </div>
        </div>

        <div className="wizard-content">
          {step === 1 && <StepPersonal formData={formData} handleChange={handleChange} />}
          {step === 2 && <StepFinancial formData={formData} handleChange={handleChange} />}
          {step === 3 && <StepVerification formData={formData} handleFileChange={handleFileChange} handlePhotoCaptured={handlePhotoCaptured} />}
          {step === 4 && <StepBehavioral formData={formData} handleChange={handleChange} openQuiz={() => setShowQuiz(true)} />}
        </div>

        <div className="wizard-actions">
          {step > 1 && (
            <button className="secondary-btn back-btn" onClick={() => setStep(step - 1)}>← Back</button>
          )}
          
          {step < TOTAL_STEPS ? (
            <button className="analyze-btn next-btn" onClick={() => setStep(step + 1)}>Next Step →</button>
          ) : (
            <button className="analyze-btn finish-btn" onClick={onAnalyze} disabled={loading}>
              {loading ? "🔄 Processing..." : "🚀 Run Risk Engine"}
            </button>
          )}
        </div>
      </section>

      <PersonalityQuizModal 
        isOpen={showQuiz} 
        onClose={() => setShowQuiz(false)} 
        onComplete={(result) => setFormData({...formData, mbti: result})} 
      />
    </div>
  );
};

// --- PAGE: RESULT DASHBOARD ---
const ResultPage = ({ result, formData, onBack }) => {
  const personalityData = [
    { subject: 'Character', A: 90, fullMark: 100 },
    { subject: 'Capacity', A: 85, fullMark: 100 },
    { subject: 'Capital', A: 60, fullMark: 100 },
    { subject: 'Conditions', A: 70, fullMark: 100 },
    { subject: 'Collateral', A: 80, fullMark: 100 },
  ];

  const financialData = [
    { name: 'Score', value: result.finance_score, color: '#10b981' },
    { name: 'Remaining', value: 100 - result.finance_score, color: 'rgba(255,255,255,0.1)' }
  ];

  const aiRiskData = [
    { name: 'Score', value: result.ai_risk_score, color: '#ef4444' },
    { name: 'Remaining', value: 100 - result.ai_risk_score, color: 'rgba(255,255,255,0.1)' }
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
      <section className="card result-section">
        <div className={`status-banner ${result.decision === "REJECT" ? "danger" : "success"}`}>
          <h1>{result.decision}</h1>
          <span className="decision-label">AI RECOMMENDED DECISION</span>
        </div>

        <div className="split-result">
          <div className="chart-container">
            <h3>🧠 5C's Credit Analysis</h3>
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
            {formData.activityTags.length > 0 && (
              <div className="vision-summary"><small>📸 Verified: {formData.activityTags.join(", ")}</small></div>
            )}
          </div>

          <div className="metrics-column">
            <div className="metric-box chart-metric">
              <span className="label">Capacity Score</span>
              <div className="pie-chart-wrapper">
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie data={financialData} cx="50%" cy="50%" innerRadius={35} outerRadius={45} startAngle={90} endAngle={-270} dataKey="value">
                      {financialData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-value"><span className="value">{result.finance_score}</span></div>
              </div>
            </div>

            <div className="metric-box chart-metric">
              <span className="label">Behavioral Risk</span>
              <div className="pie-chart-wrapper">
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie data={aiRiskData} cx="50%" cy="50%" innerRadius={35} outerRadius={45} startAngle={90} endAngle={-270} dataKey="value">
                      {aiRiskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-value"><span className="value text-red">{result.ai_risk_score}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="transparency-box">
          <p><strong>⚠️ Risk Factors Detected (NLP Analysis):</strong></p>
          {renderHighlightedEssay(formData.essay, result.risky_words)}
        </div>
      </section>

      <div className="bottom-action-container">
        <button className="back-btn-3d" onClick={onBack}>← New Application</button>
      </div>
    </div>
  );
};

// --- MAIN APP CONTROLLER ---
function App() {
  const [currentPage, setCurrentPage] = useState("input");
  // Initialize with all fields, including new personal ones
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: "",
    nric: "",
    phone: "",
    email: "",
    permAddress: "",
    currAddress: "",
    age: "",
    maritalStatus: "Single",
    dependents: 0,
    residenceLength: "",
    employment: "Employed", // Moved here as per request
    
    // Step 2: Financial
    salary: 60000,
    debt: 1500,
    creditScore: 720,
    employerName: "",

    // Step 3: Verification
    bankStatement: null,
    transactionImg: null,
    activityImage: null,
    activityTags: [],

    // Step 4: Behavioral
    mbti: "", 
    essay: "I need quick cash to cover some losses from a high-stakes investment.",
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
    }, 2000);
  };

  return (
    <div className="app-wrapper">
      <header className="navbar">
        <div className="logo">🛡️ RiskLens <span className="logo-ai">AI</span></div>
        <div className="sys-status"><span className="status-dot"></span> SYSTEM ONLINE</div>
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