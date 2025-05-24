
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Star, Trophy } from 'lucide-react';

interface QuizProps {
  onComplete: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const Quiz = ({ onComplete }: QuizProps) => {
  const questions: Question[] = [
    {
      id: 1,
      question: "What provides power to most satellites in space?",
      options: ["Batteries", "Solar panels", "Nuclear reactors", "Wind turbines"],
      correct: 1,
      explanation: "Solar panels convert sunlight into electricity, providing clean and renewable power for satellites!"
    },
    {
      id: 2,
      question: "How do satellites stay in orbit around Earth?",
      options: ["Rocket engines", "Gravity and velocity balance", "Magnetic force", "Air currents"],
      correct: 1,
      explanation: "Satellites stay in orbit due to the perfect balance between Earth's gravity pulling them down and their forward velocity!"
    },
    {
      id: 3,
      question: "What do communication satellites primarily use antennas for?",
      options: ["Taking pictures", "Measuring temperature", "Sending and receiving signals", "Collecting space dust"],
      correct: 2,
      explanation: "Antennas allow satellites to communicate with Earth by sending and receiving radio signals!"
    },
    {
      id: 4,
      question: "Which type of satellite helps us with GPS navigation?",
      options: ["Weather satellites", "Navigation satellites", "Scientific satellites", "Military satellites"],
      correct: 1,
      explanation: "Navigation satellites like GPS help us find our location and navigate on Earth!"
    },
    {
      id: 5,
      question: "What happens to a satellite without attitude control thrusters?",
      options: ["It explodes", "It tumbles uncontrollably", "It moves faster", "It changes color"],
      correct: 1,
      explanation: "Attitude control thrusters help satellites maintain proper orientation and prevent tumbling!"
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz complete
        const finalScore = selectedAnswer === questions[currentQuestion].correct ? score + 1 : score;
        const percentage = Math.round((finalScore / questions.length) * 100);
        onComplete(percentage);
      }
    }, 3000);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correct;

  return (
    <Card className="p-6 bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Space Knowledge Quiz</h2>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">{score}/{questions.length}</span>
          </div>
        </div>
        
        <Progress value={progress} className="h-2 bg-gray-800" />
        <p className="text-sm text-gray-400 mt-1">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {!showResult ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-lg border border-blue-500/30">
            <h3 className="text-xl text-white font-semibold mb-4">
              {currentQ.question}
            </h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  variant="outline"
                  className={`w-full justify-start text-left h-auto p-4 transition-all duration-300 ${
                    selectedAnswer === index
                      ? 'bg-blue-600 border-blue-400 text-white scale-105'
                      : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-blue-900/30 hover:border-blue-500'
                  }`}
                >
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className={`text-6xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? <CheckCircle className="w-16 h-16 mx-auto" /> : <XCircle className="w-16 h-16 mx-auto" />}
          </div>
          
          <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct!' : 'Not quite right!'}
          </h3>
          
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-lg border border-blue-500/30">
            <p className="text-white text-lg">{currentQ.explanation}</p>
          </div>

          {isCorrect && (
            <div className="flex justify-center">
              <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
