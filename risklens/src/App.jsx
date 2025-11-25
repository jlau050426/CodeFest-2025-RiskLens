import { useState } from "react";
import BasicInfoPage from "./pages/BasicInfoPage";
import QuizPage from "./pages/QuizPage";
import RiskOutputPage from "./pages/RiskOutputPage";
import "./App.css";

// --- MAIN APP ---
function App() {
  const [currentPage, setCurrentPage] = useState("basicInfo"); // "basicInfo", "quiz", "riskOutput"
  const [formData, setFormData] = useState({
    // Basic Information (matches JSON format)
    name: "",
    age: "",
    email: "",
    gross_monthly_income: "",
    employment_status: "",
    company_name: "",
    website_url: "",
    loan_purpose: "",
    social_links: [],
    // Quiz result
    mbti: "",
    // Legacy fields for backward compatibility with RiskOutputPage
    essay: "",
    activityTags: [],
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper function to export form data in the required JSON format
  const getFormDataAsJSON = () => {
    return {
      name: formData.name || "",
      age: formData.age ? parseInt(formData.age) : 0,
      email: formData.email || "",
      gross_monthly_income: formData.gross_monthly_income ? parseFloat(formData.gross_monthly_income) : 0.0,
      employment_status: formData.employment_status || "",
      company_name: formData.company_name || "",
      website_url: formData.website_url || "",
      loan_purpose: formData.loan_purpose || "",
      social_links: formData.social_links || [],
    };
  };

  const handleNextFromBasicInfo = () => {
    setCurrentPage("quiz");
  };

  const handleNextFromQuiz = async () => {
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
      setCurrentPage("riskOutput");
    }, 1500);
  };

  const handleBackToBasicInfo = () => {
    setCurrentPage("basicInfo");
    setResult(null);
  };

  const getPageIndicator = () => {
    const pages = [
      { id: "basicInfo", label: "Basic Info", step: 1 },
      { id: "quiz", label: "Quiz", step: 2 },
      { id: "riskOutput", label: "Results", step: 3 },
    ];
    return pages;
  };

  const pages = getPageIndicator();
  const currentStep = pages.findIndex(p => p.id === currentPage) + 1;

  return (
    <div className="app-wrapper">
      <header className="navbar">
        <div className="logo">
          🛡️ RiskLens <span className="logo-ai">System</span>
        </div>
        <div className="page-indicator">
          {pages.map((page, index) => (
            <div key={page.id} className={`step-indicator ${index + 1 <= currentStep ? "active" : ""} ${page.id === currentPage ? "current" : ""}`}>
              <div className="step-number">{page.step}</div>
              <div className="step-label">{page.label}</div>
            </div>
          ))}
        </div>
      </header>

      {currentPage === "basicInfo" && (
        <BasicInfoPage
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextFromBasicInfo}
        />
      )}

      {currentPage === "quiz" && (
        <QuizPage
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextFromQuiz}
          onBack={() => setCurrentPage("basicInfo")}
        />
      )}

      {currentPage === "riskOutput" && (
        <RiskOutputPage
          result={result}
          formData={formData}
          onBack={handleBackToBasicInfo}
        />
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner">🔄</div>
            <p>Analyzing Risk Profile...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
