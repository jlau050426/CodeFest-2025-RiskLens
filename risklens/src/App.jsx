import PersonalityQuizModal from "./personality_quiz/personality_quiz";
import StepPersonal from "./personal_info/personal_info";
import StepFinancial from "./financial/financial";
import StepVerification from "./verification/verification";
import StepBehavioral from "./behavioral/behavioral";
import ResultPage from "./result_dashboard/result_dashboard";
import axios from "axios";
import { useState, useEffect } from "react";
import "./App.css";
import DarkQuizComponent from "./quiz/quiz";
import SplashScreen from "./splash";

const InputPage = ({ formData, setFormData, onAnalyze, loading }) => {
  const [step, setStep] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const TOTAL_STEPS = 5;

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("User is attempting to leave the webpage.");
      // Use sendBeacon for reliable unload notification
      const url = "http://localhost:8000/quit";
      const data = JSON.stringify({ reason: "user left page" });
      navigator.sendBeacon(url, data);
      // Optionally show a confirmation dialog:
      // event.preventDefault();
      // event.returnValue = '';
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

  const handlePhotoCaptured = (image, tags) => {
    setFormData((prev) => ({
      ...prev,
      activityImage: image,
      activityTags: tags,
    }));
  };
  return (
    <div className="page-container">
      <section className="card input-section center-card">
        <div className="card-header">
          <div className="step-indicator">
            STEP {step} OF {TOTAL_STEPS}
          </div>
          <h2>
            {step === 1 && "👤 Personal Information"}
            {step === 2 && "💰 Financial Profile"}
            {step === 3 && "🔐 Verification"}
            {step === 4 && "🧠 Behavioral Analysis"}
            {step === 5 && "🧠 Quick Questions"}
          </h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="wizard-content">
          {step === 1 && (
            <StepPersonal formData={formData} handleChange={handleChange} />
          )}
          {step === 2 && (
            <StepFinancial formData={formData} handleChange={handleChange} />
          )}
          {step === 3 && (
            <StepVerification
              formData={formData}
              handleFileChange={handleFileChange}
              handlePhotoCaptured={handlePhotoCaptured}
            />
          )}
          {step === 4 && (
            <StepBehavioral
              formData={formData}
              handleChange={handleChange}
              openQuiz={() => setShowQuiz(true)}
            />
          )}
          {step === 5 && (
            <DarkQuizComponent />
          )}
        </div>

        <div className="wizard-actions">
          {step > 1 && (
            <button
              className="secondary-btn back-btn"
              onClick={() => setStep(step - 1)}
            >
              ← Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              className="analyze-btn next-btn"
              onClick={() => setStep(step + 1)}
            >
              Next Step →
            </button>
          ) : (
            <button
              className="analyze-btn finish-btn"
              onClick={onAnalyze}
              disabled={loading}
            >
              {loading ? <><SplashScreen isVisible={loading} /></> : "🚀 Run Risk Engine"}
            </button>
          )}
        </div>
      </section>


    </div>
  );
};

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
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
    maritalStatus: "",
    dependents: 0,
    residenceLength: "",
    employment: "Employed", // Moved here as per request
    socialLinks: "",

    // Step 2: Financial
    salary: 0,
    debt: 0,
    employerName: "",

    // Step 3: Verification
    bankStatement: null,
    transactionImg: null,
    activityImage: null,
    activityTags: [],

    // Step 4: Behavioral
    mbti: "",
    essay: "",
    websiteUrl: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeRisk = async () => {
    setLoading(true);
    const socialLinks = formData.socialLinks ? formData.socialLinks.split('\n').filter(link => link.trim()).map(link => link.trim()) : [];
    const infoData = {
      name: formData.fullName,
      age: calculateAge(formData.dateOfBirth),
      email: formData.email,
      gross_monthly_income: formData.salary,
      employment_status: formData.employment,
      company_name: formData.employerName,
      website_url: formData.websiteUrl,
      loan_purpose: formData.essay,
      social_links: socialLinks,
    };

    console.log("posting: ", infoData);
    console.log("formdata: ", formData);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/start_evaluation",
        infoData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("backend response: ", response.data);

        axios
          .get('http://127.0.0.1:8000/evaluation_result')
        
          .then((response) => {
            console.log("Data fetched successfully:");
            console.log("HTTP Status:", response.status);
            console.log("Data:", response.data);
            setResult(response.data)
            setLoading(false)
            setCurrentPage("result")
          })
  
          .catch((error) => {
            console.error("❌ Error fetching data:", error.message);
            if (error.response) {
              console.error("Response Status:", error.response.status);
            }
          });


      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        console.error("Server error:", error.response.data);
        console.error("Status:", error.response.status);
      } else if (error.request) {
        // Request made but no response received
        console.error("No response received:", error.request);
      } else {
        // Something else happened
        console.error("Error:", error.message);
      }
      throw error;
    }

    if (loading){
      return <SplashScreen isVisible={loading} />
    }

    // // Simulate API Call
    // console.log(formData)
    // setTimeout(() => {
    //   setResult({
    //     decision: "REJECT",
    //     finance_score: 85,
    //     ai_risk_score: 88,
    //     risky_words: ["high-stakes", "losses", "quick cash"]
    //   });
    //   setLoading(false);
    //   setCurrentPage("result");
    // }, 2000);
  };

  return (
    <div className="app-wrapper">
      <header className="navbar">
        <div className="logo">
          🛡️ RiskLens <span className="logo-ai">AI</span>
        </div>
        <div className="sys-status">
          <span className="status-dot"></span> SYSTEM ONLINE
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
