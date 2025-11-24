import ActivityCamera from "./webcam/webcam";

//useState: for remembering state in functional componentss
//useRef: to reference DOM elements or persist values across renders
//useCallback: to memoize functions and prevent unnecessary re-creations 


import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "../src/App.css";



// --- COMPONENT: PERSONALITY QUIZ MODAL ---
const PersonalityQuizModal = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  const handleQuizOption = (type) => {
    onComplete(type);
    onClose();
  };


  //personality quiz modal
  //questions container

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>🧠 Rapid Personality Assessment</h3>
        <p>How do you usually approach a high-stakes problem?</p>

        <div className="quiz-options">
          <button className="quiz-btn" onClick={() => handleQuizOption("INTJ")}>
            <strong>Analyze It:</strong> I break it down logically and plan a
            strategy.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ENTP")}>
            <strong>Debate It:</strong> I look for loopholes and brainstorm
            creative fixes.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ISFP")}>
            <strong>Feel It:</strong> I trust my gut instinct and values.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ESTP")}>
            <strong>Wing It:</strong> I dive in and fix things as I go.
          </button>
        </div>
        <button className="close-link" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};


// --- PAGE 1: INPUT PAGE ---
// this is where user inputs data
const InputPage = ({ formData, setFormData, onAnalyze, loading }) => {
  const [showQuiz, setShowQuiz] = useState(false); // set the quiz pop up state

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoCaptured = (image, tags) => {
    setFormData((prev) => ({
      ...prev,
      activityImage: image,
      activityTags: tags,
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
          <p className="helper-text">
            Take a photo of your current activity/spending.
          </p>
          <ActivityCamera onCapture={handlePhotoCaptured} />
        </div>

        {/* 4. Daily Log Text */}
        <div className="form-group">
          <label>Daily Activity Log (Text)</label>
          <textarea
            name="dailyActivity"
            rows="2"
            value={formData.dailyActivity}
            onChange={handleInputChange}
          />
        </div>

        {/* 5. Purpose */}
        <div className="form-group">
          <label>Loan Purpose</label>
          <textarea
            name="essay"
            rows="4"
            value={formData.essay}
            onChange={handleInputChange}
          />
        </div>

        <button className="analyze-btn" onClick={onAnalyze} disabled={loading}>
          {loading ? "🔄 Analysing..." : "🚀 Run Model"}
        </button>
      </section>

      <PersonalityQuizModal
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={(result) => setFormData({ ...formData, mbti: result })}
      />
    </div>
  );
};

// --- PAGE 2: RESULT PAGE ---
const ResultPage = ({ result, formData, onBack }) => {
  const personalityData = [
    { subject: "Risk", A: 90, fullMark: 100 },
    { subject: "Spending", A: 85, fullMark: 100 },
    { subject: "Honesty", A: 40, fullMark: 100 },
    { subject: "Stability", A: 30, fullMark: 100 },
    { subject: "Logic", A: 80, fullMark: 100 },
  ];

  // Data for Financial Score Pie Chart
  const financialData = [
    { name: "Score", value: result.finance_score, color: "#10b981" }, // Green for score
    {
      name: "Remaining",
      value: 100 - result.finance_score,
      color: "rgba(255,255,255,0.1)",
    }, // Empty part
  ];

  // Data for AI Risk Score Pie Chart
  const aiRiskData = [
    { name: "Score", value: result.ai_risk_score, color: "#ef4444" }, // Red for risk
    {
      name: "Remaining",
      value: 100 - result.ai_risk_score,
      color: "rgba(255,255,255,0.1)",
    }, // Empty part
  ];

  const renderHighlightedEssay = (text, riskyWords) => {
    if (!riskyWords) return <p>{text}</p>;
    return (
      <div className="essay-text">
        {text.split(" ").map((word, i) => {
          const clean = word.toLowerCase().replace(/[.,]/g, "");
          const isRisky = riskyWords.some((rw) => clean.includes(rw));
          return isRisky ? (
            <span key={i} className="highlight-danger">
              {word}{" "}
            </span>
          ) : (
            <span key={i}>{word} </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="page-container fade-in">
      <section className="card result-section">
        <div
          className={`status-banner ${
            result.decision === "REJECT" ? "danger" : "success"
          }`}
        >
          <h1>{result.decision}</h1>
          <span className="decision-label">AI RECOMMENDED ACTION</span>
        </div>

        <div className="split-result">
          {/* Chart Section (Left Column) */}
          <div className="chart-container">
            <h3>🧠 {formData.mbti} Psychometric Profile</h3>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={personalityData}
                >
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="User"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Show Captured Image Summary */}
            {formData.activityTags.length > 0 && (
              <div className="vision-summary">
                <small>
                  📸 Vision Detected: {formData.activityTags.join(", ")}
                </small>
              </div>
            )}
          </div>

          {/* Metrics Section (Right Column) */}
          <div className="metrics-column">
            {/* Financial Score Chart */}
            <div className="metric-box chart-metric">
              <span className="label">Financial Score</span>
              <div className="pie-chart-wrapper">
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie
                      data={financialData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={45}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {financialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-value">
                  <span className="value">{result.finance_score}</span>
                </div>
              </div>
            </div>

            {/* AI Risk Score Chart */}
            <div className="metric-box chart-metric">
              <span className="label">AI Risk Score</span>
              <div className="pie-chart-wrapper">
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie
                      data={aiRiskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={45}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {aiRiskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-value">
                  <span className="value text-red">{result.ai_risk_score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transparency Report */}
        <div className="transparency-box">
          <p>
            <strong>⚠️ Risk Factors Detected:</strong>
          </p>
          {renderHighlightedEssay(formData.essay, result.risky_words)}
        </div>
      </section>

      {/* Separate Container for the 3D Back Button */}
      <div className="bottom-action-container">
        <button className="back-btn-3d" onClick={onBack}>
          ← New Assessment
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [currentPage, setCurrentPage] = useState("input");
  const [formData, setFormData] = useState({
    mbti: "",
    dailyActivity: "I shop at luxury stores on weekends.",
    essay:
      "I need quick cash to cover some losses from a high-stakes investment.",
    activityImage: null,
    activityTags: [],
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
        risky_words: ["high-stakes", "losses", "quick cash"],
      });
      setLoading(false);
      setCurrentPage("result");
    }, 1500);
  };

  return (
    <div className="app-wrapper">
      <header className="navbar">
        <div className="logo">
          🛡️ RiskLens <span className="logo-ai">System</span>
        </div>
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
