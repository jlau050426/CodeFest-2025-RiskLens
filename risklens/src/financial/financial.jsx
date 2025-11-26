import "../../src/App.css";

// --- WIZARD STEP 2: FINANCIAL ---
const StepFinancial = ({ formData, handleChange }) => (
  <div className="fade-in">
    <div className="form-group">
      <label>Annual Gross Income ($)</label>
      <input type="number" name="salary" value={formData.salary} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Total Monthly Debt / Housing ($)</label>
      <input type="number" name="debt" value={formData.debt} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Employer / Business Name</label>
      <input type="text" name="employerName" value={formData.employerName} onChange={handleChange} placeholder="Company Name" />
    </div>
  </div>
);

export default StepFinancial;