import { useState } from "react";
import "../App.css";

// --- PAGE 1: BASIC INFO PAGE ---
const BasicInfoPage = ({ formData, setFormData, onNext }) => {
  const [socialLinkInput, setSocialLinkInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    });
  };

  const handleAddSocialLink = () => {
    if (socialLinkInput.trim()) {
      const currentLinks = formData.social_links || [];
      if (!currentLinks.includes(socialLinkInput.trim())) {
        setFormData({
          ...formData,
          social_links: [...currentLinks, socialLinkInput.trim()]
        });
        setSocialLinkInput("");
      }
    }
  };

  const handleRemoveSocialLink = (linkToRemove) => {
    const currentLinks = formData.social_links || [];
    setFormData({
      ...formData,
      social_links: currentLinks.filter(link => link !== linkToRemove)
    });
  };

  const handleSocialLinkKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSocialLink();
    }
  };

  return (
    <div className="page-container fade-in">
      <section className="card input-section center-card">
        <div className="card-header">
          <h2>📂 Step 1: Basic Information</h2>
          <p>Provide your personal and employment information.</p>
        </div>

        {/* 1. Name */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* 2. Age */}
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleInputChange}
            placeholder="Enter your age"
            min="18"
            max="120"
            required
          />
        </div>

        {/* 3. Email */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />
        </div>

        {/* 4. Gross Monthly Income */}
        <div className="form-group">
          <label>Gross Monthly Income</label>
          <input
            type="number"
            name="gross_monthly_income"
            value={formData.gross_monthly_income || ""}
            onChange={handleInputChange}
            placeholder="Enter your monthly income"
            min="0"
            step="0.01"
            required
          />
          <p className="helper-text">Enter your total monthly income before deductions.</p>
        </div>

        {/* 5. Employment Status */}
        <div className="form-group">
          <label>Employment Status</label>
          <select
            name="employment_status"
            value={formData.employment_status || ""}
            onChange={handleInputChange}
            required
          >
            <option value="">Select employment status</option>
            <option value="employed">Employed (Full-time)</option>
            <option value="part-time">Employed (Part-time)</option>
            <option value="self-employed">Self-Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        {/* 6. Company Name */}
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name || ""}
            onChange={handleInputChange}
            placeholder="Enter your company name"
          />
        </div>

        {/* 7. Website URL */}
        <div className="form-group">
          <label>Website URL</label>
          <input
            type="url"
            name="website_url"
            value={formData.website_url || ""}
            onChange={handleInputChange}
            placeholder="https://example.com"
          />
          <p className="helper-text">Enter your company or personal website URL (optional).</p>
        </div>

        {/* 8. Social Links */}
        <div className="form-group">
          <label>Social Links</label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="url"
              value={socialLinkInput}
              onChange={(e) => setSocialLinkInput(e.target.value)}
              onKeyPress={handleSocialLinkKeyPress}
              placeholder="https://linkedin.com/in/your-profile"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="secondary-btn"
              onClick={handleAddSocialLink}
              disabled={!socialLinkInput.trim()}
            >
              Add Link
            </button>
          </div>
          {formData.social_links && formData.social_links.length > 0 && (
            <div className="social-links-list">
              {formData.social_links.map((link, index) => (
                <div key={index} className="social-link-item">
                  <span>{link}</span>
                  <button
                    type="button"
                    className="remove-link-btn"
                    onClick={() => handleRemoveSocialLink(link)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="helper-text">Add your LinkedIn, GitHub, or other professional profile links.</p>
        </div>

        {/* 9. Loan Purpose */}
        <div className="form-group">
          <label>Loan Purpose</label>
          <textarea
            name="loan_purpose"
            rows="4"
            value={formData.loan_purpose || ""}
            onChange={handleInputChange}
            placeholder="Explain why you need this loan and how you plan to use it..."
            required
          />
          <p className="helper-text">Provide a clear explanation of your loan purpose.</p>
        </div>

        <button className="analyze-btn" onClick={onNext}>
          Next: Personality Assessment →
        </button>
      </section>
    </div>
  );
};

export default BasicInfoPage;

