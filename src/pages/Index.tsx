
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar3D } from '@/components/Avatar3D';
import { WebcamFeed } from '@/components/WebcamFeed';
import { SatelliteBuilder } from '@/components/SatelliteBuilder';
import { Quiz } from '@/components/Quiz';
import { Rocket, Satellite, Trophy, Star, Play, Award } from 'lucide-react';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'lesson' | 'building' | 'quiz' | 'complete'>('welcome');
  const [webcamPermission, setWebcamPermission] = useState(false);
  const [progress, setProgress] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

  const steps = {
    welcome: 0,
    lesson: 25,
    building: 50,
    quiz: 75,
    complete: 100
  };

  useEffect(() => {
    setProgress(steps[currentStep]);
  }, [currentStep]);

  const requestWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setWebcamPermission(true);
      setCurrentStep('lesson');
      // Stop the stream as we'll create a new one in the WebcamFeed component
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const handleLessonComplete = () => {
    setCurrentStep('building');
    setBadges(prev => [...prev, 'Space Knowledge']);
  };

  const handleBuildingComplete = () => {
    setCurrentStep('quiz');
    setBadges(prev => [...prev, 'Satellite Engineer']);
  };

  const handleQuizComplete = (score: number) => {
    setCurrentStep('complete');
    if (score >= 80) {
      setBadges(prev => [...prev, 'Space Expert']);
    } else {
      setBadges(prev => [...prev, 'Space Explorer']);
    }
  };

  return (
    <div className="min-h-screen bg-space-gradient relative overflow-hidden">
      {/* Animated Stars Background */}
      <div className="stars">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="star" />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-10 h-10 text-blue-400 animate-pulse-glow" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Spacey Academy
            </h1>
            <Satellite className="w-10 h-10 text-purple-400 animate-float" />
          </div>
          <p className="text-xl text-gray-300">Build Your Own Satellite</p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mt-6">
            <Progress value={progress} className="h-2 bg-gray-800" />
            <p className="text-sm text-gray-400 mt-2">{progress}% Complete</p>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex justify-center gap-2 mt-4">
              {badges.map((badge, index) => (
                <Badge key={index} className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black animate-pulse-glow">
                  <Award className="w-4 h-4 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Welcome Screen */}
        {currentStep === 'welcome' && (
          <Card className="max-w-2xl mx-auto p-8 bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
            <div className="text-center space-y-6">
              <div className="relative">
                <Avatar3D isAnimated={true} />
              </div>
              <h2 className="text-3xl font-bold text-white">Welcome to Space Academy!</h2>
              <p className="text-gray-300 text-lg">
                I'm Captain Cosmos, your AI space guide! Today we'll learn how to build satellites 
                and explore the wonders of space engineering. Are you ready for an amazing journey?
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  We'll need access to your camera and microphone for the best learning experience.
                </p>
                <Button 
                  onClick={requestWebcamPermission}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Your Space Adventure
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lesson Screen */}
        {currentStep === 'lesson' && webcamPermission && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
                <Avatar3D isAnimated={isAvatarSpeaking} />
              </Card>
            </div>
            <div className="space-y-6">
              <WebcamFeed />
              <Card className="p-4 bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-3">Lesson: Satellite Basics</h3>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p>🛰️ Satellites orbit Earth to provide communications, weather data, and GPS!</p>
                  <p>⚡ Solar panels power satellites using energy from the Sun.</p>
                  <p>📡 Antennas help satellites communicate with Earth.</p>
                  <p>🔧 Every satellite needs: Power, Communication, and Control systems.</p>
                </div>
                <Button 
                  onClick={handleLessonComplete}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                >
                  I'm Ready to Build!
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* Building Screen */}
        {currentStep === 'building' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <SatelliteBuilder onComplete={handleBuildingComplete} />
            </div>
            <div className="space-y-6">
              <WebcamFeed />
              <Card className="p-4 bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-3">Build Instructions</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>1. Add solar panels for power ⚡</p>
                  <p>2. Install communication antennas 📡</p>
                  <p>3. Add scientific instruments 🔬</p>
                  <p>4. Test your satellite design 🚀</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Quiz Screen */}
        {currentStep === 'quiz' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Quiz onComplete={handleQuizComplete} />
            </div>
            <div className="space-y-6">
              <WebcamFeed />
              <Card className="p-4 bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-3">Quiz Time! 🧠</h3>
                <p className="text-gray-300 text-sm">
                  Test your knowledge about satellites and space technology. 
                  Answer all questions to earn your space certification!
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* Completion Screen */}
        {currentStep === 'complete' && (
          <Card className="max-w-2xl mx-auto p-8 bg-gray-900/50 border-green-500/20 backdrop-blur-sm text-center">
            <div className="space-y-6">
              <div className="relative">
                <Avatar3D isAnimated={true} />
              </div>
              <div className="text-6xl">🎉</div>
              <h2 className="text-3xl font-bold text-white">Mission Accomplished!</h2>
              <p className="text-gray-300 text-lg">
                Congratulations! You've successfully completed the satellite building mission. 
                You're now a certified space engineer!
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                {badges.map((badge, index) => (
                  <Badge key={index} className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-lg p-3 animate-pulse-glow">
                    <Trophy className="w-5 h-5 mr-2" />
                    {badge}
                  </Badge>
                ))}
              </div>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full"
              >
                <Star className="w-5 h-5 mr-2" />
                Start New Mission
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
