import ActivityCamera from "../webcam/webcam";
import "./verification.css";
import "../../src/App.css";
import AdvancedFileUpload from "./advancedFileUpload";

// --- WIZARD STEP 3: VERIFICATION ---
const StepVerification = ({ formData, handleFileChange, handlePhotoCaptured }) => (
  <div className="fade-in">
    <div className="form-group">
      <label>Proof of Income (Bank Statement PDF)</label>
      <div className="file-upload-box">
        <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'bankStatement')} />
        <span>{formData.bankStatement ? `📄 ${formData.bankStatement.name}` : "📎 Drag & drop PDF here"}</span>
      </div>
    </div>
    <div className="form-group">
      <label>Latest Transaction Record (Image)</label>
      <div className="file-upload-box">
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'transactionImg')} />
        <span>{formData.transactionImg ? `🖼️ ${formData.transactionImg.name}` : "📎 Upload Transaction Screenshot"}</span>
      </div>
    </div>

    <AdvancedFileUpload/>
    <div className="form-group">
      <label>Liveness Check (Robot Detection)</label>
      <ActivityCamera onCapture={handlePhotoCaptured} />
    </div>
  </div>
);

export default StepVerification;