import "./result_dashboard.css";
import "../../src/App.css";
import "../../src/index.css";
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

// --- PAGE: RESULT DASHBOARD ---
const ResultPage = ({ result, formData, onBack }) => {
  const personalityData = [
    { subject: "Character", A: 90, fullMark: 100 },
    { subject: "Capacity", A: 85, fullMark: 100 },
    { subject: "Capital", A: 60, fullMark: 100 },
    { subject: "Conditions", A: 70, fullMark: 100 },
    { subject: "Collateral", A: 80, fullMark: 100 },
  ];

  const financialData = [
    { name: "Score", value: result.credit_score, color: "#10b981" },
    {
      name: "Remaining",
      value: 100 - result.credit_score,
      color: "rgba(255,255,255,0.1)",
    },
  ];

  const aiRiskData = [
    { name: "Score", value: result.credit_score, color: "#ef4444" },
    {
      name: "Remaining",
      value: 100 - result.credit_score,
      color: "rgba(255,255,255,0.1)",
    },
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
          <span className="decision-label">RECOMMENDED DECISION</span>
        </div>

        <div className="split-result">
          {/* <div className="chart-container">
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
          </div> */}

          <div className="flex flex-column width-full">
            <div className="metric-box chart-metric">
              <span className="label">Credit Score</span>
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
          </div>
        </div>

        <p className="text-gray-200 text-base leading-relaxed mb-10">
            <span className="font-bold text-white block mb-1">Comment:</span>
            {result.comment}
          </p>

        <div className="bg-gray-900/70 p-6 rounded-xl shadow-2xl border border-red-800  relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-black/30 opacity-50 z-0"></div>

          <div className="relative z-10 space-y-4">
            <p className="flex items-center text-lg font-bold text-red-400 mb-4">
              <span className="mr-3 text-2xl inline-block rounded-full p-1">
                ⚠️
              </span>
              Risk Factors Detected:
            </p>
            <p
              className="text-red-300 text-sm leading-relaxed bg-red-900/40 p-4 rounded-lg border border-red-700/60 shadow-inner shadow-red-900/30 "
            >
              <span className="font-semibold text-red-200">Risk factors:</span>{" "}
              {result.risk_factor}
            </p>
          </div>
        </div>

        {/* <div className="transparency-box">
          <p><strong>⚠️ Risk Factors Detected (NLP Analysis):</strong></p>
          {renderHighlightedEssay(result.comment, result.risk_factor)}
          <p>Comment: {result.comment}</p>
          <p>Risk factors: {result.risk_factor}</p>
        </div> */}
      </section>

      <div className="bottom-action-container">
        <button className="back-btn-3d" onClick={onBack}>
          ← New Application
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
