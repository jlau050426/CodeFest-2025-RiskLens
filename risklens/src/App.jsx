import PersonalityQuizModal from './personality_quiz/personality_quiz';
import StepPersonal from './personal_info/personal_info';
import StepFinancial from './financial/financial';
import StepVerification from './verification/verification';
import StepBehavioral from './behavioral/behavioral';
import ResultPage from './result_dashboard/result_dashboard';

import { useState} from 'react';
import './App.css';

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
    dateOfBirth: "",
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