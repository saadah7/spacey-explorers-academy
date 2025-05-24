
import { useState } from 'react';
import { CheckCircle, XCircle, Star } from 'lucide-react';

interface SimpleQuizProps {
  onComplete: (score: number) => void;
}

export const SimpleQuiz = ({ onComplete }: SimpleQuizProps) => {
  // Quiz questions - simple and educational
  const questions = [
    {
      question: "What gives satellites their power?",
      options: ["Batteries", "Solar panels", "Gas", "Wind"],
      correct: 1,
      explanation: "Solar panels turn sunlight into electricity for satellites!"
    },
    {
      question: "How do satellites stay up in space?",
      options: ["They float", "Rockets push them", "Gravity and speed", "Magic"],
      correct: 2,
      explanation: "Satellites balance gravity pulling them down with their speed going forward!"
    },
    {
      question: "What do satellite antennas do?",
      options: ["Take pictures", "Talk to Earth", "Steer the satellite", "Keep it warm"],
      correct: 1,
      explanation: "Antennas send and receive messages between the satellite and Earth!"
    },
    {
      question: "Which satellites help us find directions?",
      options: ["Weather satellites", "GPS satellites", "TV satellites", "Space telescopes"],
      correct: 1,
      explanation: "GPS satellites tell our phones and cars where we are!"
    },
    {
      question: "What do thrusters help satellites do?",
      options: ["Go faster", "Point the right way", "Take better pictures", "Use less power"],
      correct: 1,
      explanation: "Thrusters help satellites turn and point in the right direction!"
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  // Handle answer selection
  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  // Go to next question
  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    // Check if answer is correct
    if (selectedAnswer === questions[currentQ].correct) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
    
    // Move to next question after showing result
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz finished
        const finalScore = selectedAnswer === questions[currentQ].correct ? score + 1 : score;
        const percentage = Math.round((finalScore / questions.length) * 100);
        onComplete(percentage);
      }
    }, 2500);
  };

  const progress = ((currentQ + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQ];
  const isCorrect = selectedAnswer === currentQuestion.correct;

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-blue-400">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Space Quiz</h2>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-white">{score}/{questions.length}</span>
          </div>
        </div>
        
        {/* Simple progress bar */}
        <div className="bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Question {currentQ + 1} of {questions.length}
        </p>
      </div>

      {!showResult ? (
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded border border-gray-600">
            <h3 className="text-white text-lg mb-4">{currentQuestion.question}</h3>
            
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-3 text-left rounded border transition-all ${
                    selectedAnswer === index
                      ? 'bg-blue-700 border-blue-500 text-white'
                      : 'bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={nextQuestion}
              disabled={selectedAnswer === null}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded"
            >
              {currentQ === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className={`text-4xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? <CheckCircle className="w-12 h-12 mx-auto" /> : <XCircle className="w-12 h-12 mx-auto" />}
          </div>
          
          <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct!' : 'Not quite right!'}
          </h3>
          
          <div className="bg-gray-700 p-4 rounded border border-gray-600">
            <p className="text-white">{currentQuestion.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
