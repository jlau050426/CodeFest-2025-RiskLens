import ActivityCamera from "../webcam/webcam";
import "../App.css";

// --- PAGE 1: BASIC INFO PAGE ---
const BasicInfoPage = ({ formData, setFormData, onNext }) => {
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
          <h2>📂 Step 1: Basic Information</h2>
          <p>Provide your basic information and activity details.</p>
        </div>

        {/* 1. PDF Upload */}
        <div className="form-group">
          <label>Upload Bank Statements (PDF)</label>
          <div className="file-upload-box">
            <input type="file" accept=".pdf" />
            <span>📎 Drag & drop PDF here</span>
          </div>
        </div>

        {/* 2. Camera Activity Log */}
        <div className="form-group">
          <label>Live Activity Verification</label>
          <p className="helper-text">
            Take a photo of your current activity/spending.
          </p>
          <ActivityCamera onCapture={handlePhotoCaptured} />
        </div>

        {/* 3. Daily Log Text */}
        <div className="form-group">
          <label>Daily Activity Log (Text)</label>
          <textarea
            name="dailyActivity"
            rows="2"
            value={formData.dailyActivity}
            onChange={handleInputChange}
            placeholder="Describe your daily activities..."
          />
        </div>

        {/* 4. Loan Purpose */}
        <div className="form-group">
          <label>Loan Purpose</label>
          <textarea
            name="essay"
            rows="4"
            value={formData.essay}
            onChange={handleInputChange}
            placeholder="Explain why you need this loan..."
          />
        </div>

        <button className="analyze-btn" onClick={onNext}>
          Next: Personality Assessment →
        </button>
      </section>
    </div>
  );
};

export default BasicInfoPage;

