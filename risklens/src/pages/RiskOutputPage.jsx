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
import "../App.css";

// --- PAGE 3: RISK OUTPUT PAGE ---
const RiskOutputPage = ({ result, formData, onBack }) => {
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
        <div className="card-header">
          <h2>📊 Step 3: Risk Assessment Results</h2>
          <p>Your comprehensive risk analysis is ready.</p>
        </div>
        
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

export default RiskOutputPage;

