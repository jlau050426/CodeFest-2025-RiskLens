import "../App.css";

// --- PAGE 2: QUIZ PAGE ---
const QuizPage = ({ formData, setFormData, onNext, onBack }) => {
  const handleQuizOption = (type) => {
    setFormData({ ...formData, mbti: type });
  };

  return (
    <div className="page-container fade-in">
      <section className="card input-section center-card">
        <div className="card-header">
          <h2>🧠 Step 2: Personality Assessment</h2>
          <p>Complete the personality profile to continue.</p>
        </div>

        <div className="quiz-container">
          <div className="quiz-question">
            <h3>How do you usually approach a high-stakes problem?</h3>
          </div>

          <div className="quiz-options-full">
            <button 
              className={`quiz-btn-full ${formData.mbti === "INTJ" ? "selected" : ""}`}
              onClick={() => handleQuizOption("INTJ")}
            >
              <strong>Analyze It:</strong> I break it down logically and plan a strategy.
            </button>
            <button 
              className={`quiz-btn-full ${formData.mbti === "ENTP" ? "selected" : ""}`}
              onClick={() => handleQuizOption("ENTP")}
            >
              <strong>Debate It:</strong> I look for loopholes and brainstorm creative fixes.
            </button>
            <button 
              className={`quiz-btn-full ${formData.mbti === "ISFP" ? "selected" : ""}`}
              onClick={() => handleQuizOption("ISFP")}
            >
              <strong>Feel It:</strong> I trust my gut instinct and values.
            </button>
            <button 
              className={`quiz-btn-full ${formData.mbti === "ESTP" ? "selected" : ""}`}
              onClick={() => handleQuizOption("ESTP")}
            >
              <strong>Wing It:</strong> I dive in and fix things as I go.
            </button>
          </div>

          {formData.mbti && (
            <div className="quiz-result-preview">
              <p>Selected: <strong>{formData.mbti}</strong></p>
            </div>
          )}
        </div>

        <div className="page-navigation">
          <button className="back-btn-3d" onClick={onBack}>
            ← Back
          </button>
          <button 
            className="analyze-btn" 
            onClick={onNext}
            disabled={!formData.mbti}
          >
            Next: Run Analysis →
          </button>
        </div>
      </section>
    </div>
  );
};

export default QuizPage;

