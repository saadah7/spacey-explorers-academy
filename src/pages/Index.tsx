
import { useState, useEffect } from 'react';
import { Rocket, Satellite, Trophy, Star, Play, Award } from 'lucide-react';
import { SimpleAvatar } from '@/components/SimpleAvatar';
import { BasicWebcam } from '@/components/BasicWebcam';
import { SatelliteBuilding } from '@/components/SatelliteBuilding';
import { SimpleQuiz } from '@/components/SimpleQuiz';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'lesson' | 'building' | 'quiz' | 'complete'>('welcome');
  const [webcamAllowed, setWebcamAllowed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  // Calculate progress based on current step
  useEffect(() => {
    const stepProgress = {
      welcome: 0,
      lesson: 25,
      building: 50,
      quiz: 75,
      complete: 100
    };
    setProgress(stepProgress[currentStep]);
  }, [currentStep]);

  // Ask for webcam permission and start lesson
  const startLearning = async () => {
    try {
      // Request camera permission
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setWebcamAllowed(true);
      setCurrentStep('lesson');
    } catch (error) {
      console.log('Camera access denied:', error);
      // Continue anyway - webcam is optional
      setCurrentStep('lesson');
    }
  };

  // Move from lesson to building phase
  const finishLesson = () => {
    setCurrentStep('building');
    setEarnedBadges(prev => [...prev, 'Space Student']);
  };

  // Move from building to quiz phase
  const finishBuilding = () => {
    setCurrentStep('quiz');
    setEarnedBadges(prev => [...prev, 'Satellite Builder']);
  };

  // Finish the quiz and complete the course
  const finishQuiz = (score: number) => {
    setCurrentStep('complete');
    if (score >= 80) {
      setEarnedBadges(prev => [...prev, 'Space Expert']);
    } else {
      setEarnedBadges(prev => [...prev, 'Space Explorer']);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 relative">
      {/* Simple stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Basic animated stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">
              Spacey Academy
            </h1>
            <Satellite className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-xl text-gray-300">Build Your Own Satellite</p>
          
          {/* Progress bar */}
          <div className="max-w-md mx-auto mt-6">
            <div className="bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">{progress}% Complete</p>
          </div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              {earnedBadges.map((badge, index) => (
                <div key={index} className="bg-yellow-600 text-black px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {badge}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Welcome Screen */}
        {currentStep === 'welcome' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-lg border border-blue-400">
              <div className="text-center space-y-6">
                <SimpleAvatar isAnimated={true} />
                <h2 className="text-2xl font-bold text-white">Welcome to Space Academy!</h2>
                <p className="text-gray-300 text-lg">
                  Hi! I'm Captain Cosmos, and I'll teach you how to build satellites today! 
                  We'll learn about space technology and build our very own satellite together.
                </p>
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    We'll use your camera for the best learning experience (optional).
                  </p>
                  <button 
                    onClick={startLearning}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg flex items-center gap-2 mx-auto transition-all hover:scale-105"
                  >
                    <Play className="w-5 h-5" />
                    Start Space Adventure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Screen */}
        {currentStep === 'lesson' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SimpleAvatar isAnimated={true} />
            </div>
            <div className="space-y-6">
              {webcamAllowed && <BasicWebcam />}
              <div className="bg-gray-800 p-4 rounded-lg border border-blue-400">
                <h3 className="text-white font-bold mb-3">Lesson: Satellite Basics</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>🛰️ Satellites orbit Earth to help us communicate and explore space!</p>
                  <p>⚡ Solar panels give satellites power from the Sun.</p>
                  <p>📡 Antennas let satellites talk to Earth.</p>
                  <p>🔧 Every satellite needs power, communication, and control systems.</p>
                </div>
                <button 
                  onClick={finishLesson}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                >
                  Ready to Build! →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Building Screen */}
        {currentStep === 'building' && (
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <SatelliteBuilding onComplete={finishBuilding} />
            </div>
            <div className="space-y-6">
              {webcamAllowed && <BasicWebcam />}
              <div className="bg-gray-800 p-4 rounded-lg border border-blue-400">
                <h3 className="text-white font-bold mb-3">Building Guide</h3>
                <div className="space-y-1 text-gray-300 text-sm">
                  <p>1. Add solar panels for power ⚡</p>
                  <p>2. Install antenna for communication 📡</p>
                  <p>3. Add camera for science 🔬</p>
                  <p>4. Install thrusters for control 🚀</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Screen */}
        {currentStep === 'quiz' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SimpleQuiz onComplete={finishQuiz} />
            </div>
            <div className="space-y-6">
              {webcamAllowed && <BasicWebcam />}
              <div className="bg-gray-800 p-4 rounded-lg border border-blue-400">
                <h3 className="text-white font-bold mb-3">Quiz Time! 🧠</h3>
                <p className="text-gray-300 text-sm">
                  Test what you learned about satellites and space technology. 
                  Answer the questions to earn your space certificate!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Completion Screen */}
        {currentStep === 'complete' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-lg border border-green-500 text-center">
              <div className="space-y-6">
                <SimpleAvatar isAnimated={true} />
                <div className="text-4xl">🎉</div>
                <h2 className="text-2xl font-bold text-white">Mission Complete!</h2>
                <p className="text-gray-300 text-lg">
                  Congratulations! You've successfully learned about satellites and completed 
                  your space engineering mission. You're now a certified space explorer!
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {earnedBadges.map((badge, index) => (
                    <div key={index} className="bg-yellow-600 text-black px-4 py-2 rounded-full flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      {badge}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 mx-auto"
                >
                  <Star className="w-5 h-5" />
                  Start New Mission
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
