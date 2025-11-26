import React, { useState, useCallback } from 'react';
import axios from 'axios';

// --- Quiz Data ---
const quizQuestions = [
  {
    id: 1,
    question: "What would be your response when someone doesn’t give you the money they borrowed?",
    answers: [
      { text: "Usually I forgot about things like that", score: -2 },
      { text: "Wait for them to get the money back", score: -1 },
      { text: "Do everything to get the money back", score: 1 },
      { text: "Remind them to give the money back", score: 2 },
    ],
  },
  {
    id: 2,
    question: "How do you prefer to receive feedback on your work?",
    answers: [
      { text: "Directly, with specific examples and a clear action plan.", score: -2 },
      { text: "In a positive, constructive group setting.", score: -1 },
      { text: "Through a detailed, quantitative performance report.", score: 1 },
      { text: "Only when absolutely necessary, focusing on outcomes.", score: 2 },
    ],
  },
  {
    id: 3,
    question: "If you have a reason to change yourself, what would be the reason?",
    answers: [
      { text: "to lead my team", score: -2 },
      { text: "to get job", score: -1 },
      { text: "for my family", score: 1 },
      { text: "to impress someone I like", score: 2 },
    ],
  },
  {
    id: 4,
    question: "What advice would you give to current high school students?",
    answers: [
      { text: "Create the best memories, because childhood will never be found again", score: -2 },
      { text: "Study hard", score: -1 },
      { text: "It is better to learn from generation before you", score: 1 },
      { text: "Being kindness is more important than being knowledgeable", score: 2 },
    ],
  },
  {
    id: 5,
    question: "When you need to do something you don't like:",
    answers: [
      { text: "Leaving immediately", score: -2 },
      { text: "Get angry", score: -1 },
      { text: "Do it somehow", score: 1 },
      { text: "It's normal to happen this kind of things", score: 2 },
    ],
  },
];

// --- Component ---
const DarkQuizComponent = () => {
  // State to store the user's selected answers (Key: Question ID, Value: Score)
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to handle answer selection
  const handleAnswerSelect = useCallback((questionId, score) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: score,
    }));
    // Clear any previous submission status message
    setSubmissionStatus('');
  }, []);

  // Calculate the total score
  const totalScore = Object.values(selectedAnswers).reduce((sum, score) => sum + score, 0);

  // Check if all questions have been answered
  const allAnswered = Object.keys(selectedAnswers).length === quizQuestions.length;

  // Function to submit the score
  const handleSubmit = async () => {
    if (!allAnswered) {
      setSubmissionStatus('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('Submitting score...');
    const API_URL = `http://127.0.0.1:8000/test-score?score=${totalScore}`;

    try {
      const response = await axios.get(API_URL);
      console.log("quiz response: " , response.status)
      setSubmissionStatus(`Successfully submitted`);
    } catch (error) {
      console.error('API Submission Error:', error);
      // Display a user-friendly error message
      setSubmissionStatus(`❌ Error submitting score. Please check the console.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  return (
    // Base container styling matching the dark scheme
    <div className="">
     
        
    

        {/* Question Loop */}
        {quizQuestions.map((q, qIndex) => (
          <div key={q.id} className="p-4 rounded-lg bg-gray-800 shadow-inner">
            <p className="text-lg font-semibold mb-3 text-blue-300">
              {qIndex + 1}. {q.question}
            </p>
            
            {/* Answers Grid/List */}
            <div className="space-y-2">
              {q.answers.map((a, aIndex) => {
                const isSelected = selectedAnswers[q.id] === a.score;
                return (
                  <button
                    key={aIndex}
                    onClick={() => handleAnswerSelect(q.id, a.score)}
                    className={`
                      w-full text-left p-3 rounded-md transition-all duration-200 ease-in-out 
                      focus:outline-none focus:ring-2 
                      ${isSelected
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 focus:ring-blue-400'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500'
                      }
                    `}
                  >
                    {a.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* --- Submission Section --- */}
        <div className="pt-4 border-t border-blue-500/50">
            
            {/* Display Current Score */}
            <p className="text-white text-md mb-4">
                {/* Total Score Potential: <span className="font-bold text-blue-400">{totalScore}</span> */}
            </p>

            {/* Submission Button */}
            <button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className={`
                    w-full py-3 rounded-lg font-semibold transition-all duration-300
                    ${allAnswered && !isSubmitting
                        ? 'bg-blue-700 text-white hover:bg-blue-600 shadow-xl shadow-blue-700/50'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                `}
            >
                {isSubmitting ? 'Sending Score...' : 'Submit Assessment'}
            </button>

            {/* Submission Status Message */}
            {submissionStatus && (
                <p className={`mt-4 text-center p-2 rounded-md ${submissionStatus.startsWith('Successfully') ? 'bg-green-800 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {submissionStatus}
                </p>
            )}

        </div>
      
    </div>
  );
};

export default DarkQuizComponent;