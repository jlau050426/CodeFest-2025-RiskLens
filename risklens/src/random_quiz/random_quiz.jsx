import "./random_quiz.css";

// --- COMPONENT: PERSONALITY QUIZ MODAL ---
const PersonalityQuizModal = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  const handleQuizOption = (type) => {
    onComplete(type);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>🧠 Character Assessment</h3>
        <p>If you encountered an unexpected financial loss, what is your first reaction?</p>
        <div className="quiz-options">
          <button className="quiz-btn" onClick={() => handleQuizOption("INTJ")}>
            <strong>Strategize:</strong> Immediate budget cut and debt restructuring.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ENTP")}>
            <strong>Innovate:</strong> Find a new high-risk, high-reward income source.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ISFP")}>
            <strong>Adapt:</strong> Sell assets and live minimally until recovered.
          </button>
          <button className="quiz-btn" onClick={() => handleQuizOption("ESTP")}>
            <strong>Action:</strong> Work overtime or second job immediately.
          </button>
        </div>
        <button className="close-link" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PersonalityQuizModal;