import "../../src/App.css";

// --- WIZARD STEP 4: BEHAVIORAL ---
const StepBehavioral = ({ formData, handleChange, openQuiz }) => (
  <div className="fade-in">
    <div className="form-group">
      <label>Personality Profile </label>
      <div className="quiz-group">
        <input type="text" value={formData.mbti} readOnly placeholder="Pending Assessment..." />
        <button className="secondary-btn" onClick={openQuiz}>⚡ Start Test</button>
      </div>
    </div>
    <div className="form-group">
      <label>Statement of Loan Purpose (Loan Essay)</label>
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

export default StepBehavioral;