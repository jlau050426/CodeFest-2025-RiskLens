import "./personal_info.css";
import "../../src/App.css";

// --- WIZARD STEP 1: PERSONAL INFO (NEW) ---
const StepPersonal = ({ formData, handleChange }) => (
  <div className="fade-in">
    <div className="form-row">
      <div className="form-group">
        <label>Full Name (As per IC)</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. TONY STARK"
        />
      </div>
      <div className="form-group">
        <label>NRIC / Passport No.</label>
        <input
          type="text"
          name="nric"
          placeholder="e.g. 123456-13-7890"
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Phone Number</label>
        <textarea
          name="phone no."
          rows="1"
          placeholder="e.g. +60-12-3456789"
        />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <textarea
          name="email"
          rows="1"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. iamaboy1234@gmail.com"
        />
      </div>
    </div>

    <div className="form-group">
      <label>Permanent Address</label>
      <textarea
        name="permAddress"
        rows="2"

      />
    </div>
    <div className="form-group">
      <label>Current Address</label>
      <textarea
        name="currAddress"
        rows="2"

        placeholder="If different from above"
      />
    </div>
    <div className="form-group">
      <label>Social Links (one per line)</label>
      <textarea
        name="socialLinks"
        rows="3"
        value={formData.socialLinks}
        onChange={handleChange}
        placeholder="Enter each social link on a new line, e.g.&#10;https://linkedin.com/in/your-profile&#10;https://github.com/your-username"
      />
      <small style={{ color: '#888', marginTop: '4px', display: 'block' }}>
        Add multiple links by pressing Enter after each one
      </small>
    </div>

    <div className="form-row three-col">
      {/* MODIFIED SECTION STARTS HERE */}
      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Marital Status</label>
        <select
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
        >
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>
      <div className="form-group">
        <label>Dependents</label>
        <input
          type="number"
          name="dependents"
          value={formData.dependents}
          onChange={handleChange}
          min={0}
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Length of Residence (Years)</label>
        <input
          type="number"
          name="residenceLength"
          value={formData.residenceLength}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Employment Status</label>
        <select
          name="employment"
          value={formData.employment}
          onChange={handleChange}
        >
          <option value="Employed">Employed</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Unemployed">Unemployed</option>
        </select>
      </div>
    </div>
  </div>
);

export default StepPersonal;
