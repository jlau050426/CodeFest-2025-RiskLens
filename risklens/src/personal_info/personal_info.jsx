import "./personal_info.css";

// --- PERSONAL INFO  --- //
const StepPersonal = ({ formData, handleChange }) => (
  <div className="fade-in">
    <div className="form-row">
      <div className="form-group">
        <label>Full Name (As per ID)</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. John Doe" />
      </div>
      <div className="form-group">
        <label>NRIC / Passport No.</label>
        <input type="text" name="nric" value={formData.nric} onChange={handleChange} placeholder="e.g. 901010-10-1234" />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Phone Number</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
    </div>

    <div className="form-group">
      <label>Permanent Address</label>
      <textarea name="permAddress" rows="2" value={formData.permAddress} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Current Address</label>
      <textarea name="currAddress" rows="2" value={formData.currAddress} onChange={handleChange} placeholder="If different from above" />
    </div>

    <div className="form-row three-col">
      <div className="form-group">
        <label>Age</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Marital Status</label>
        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>
      <div className="form-group">
        <label>Dependents</label>
        <input type="number" name="dependents" value={formData.dependents} onChange={handleChange} />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Length of Residence (Years)</label>
        <input type="number" name="residenceLength" value={formData.residenceLength} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Employment Status</label>
        <select name="employment" value={formData.employment} onChange={handleChange}>
          <option value="Employed">Employed</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Unemployed">Unemployed</option>
        </select>
      </div>
    </div>
  </div>
);

export default StepPersonal;