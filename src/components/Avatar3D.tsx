
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Avatar3DProps {
  isAnimated?: boolean;
}

export const Avatar3D = ({ isAnimated = false }: Avatar3DProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const messages = [
    "Hello there, future space explorer! I'm Captain Cosmos, your AI guide to the wonderful world of satellites!",
    "Satellites are amazing machines that orbit our planet, helping us communicate, navigate, and study space!",
    "Today, we'll learn how to build our very own satellite. Are you excited? I know I am!",
    "Every satellite needs three essential systems: power from solar panels, communication antennas, and control computers!",
    "Let's start building and discover the secrets of space technology together!"
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // Move to next message after a pause
        setTimeout(() => {
          setMessageIndex(prev => (prev + 1) % messages.length);
        }, 2000);
      };
      
      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speak(messages[messageIndex]);
    }
  };

  useEffect(() => {
    setCurrentMessage(messages[messageIndex]);
  }, [messageIndex]);

  useEffect(() => {
    if (isAnimated && !isSpeaking) {
      const timer = setTimeout(() => {
        speak(messages[messageIndex]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAnimated, messageIndex]);

  return (
    <Card className="relative p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30 backdrop-blur-sm">
      {/* 3D Avatar Container */}
      <div className="relative h-64 flex items-center justify-center">
        {/* Avatar Background Glow */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 ${isSpeaking ? 'animate-pulse-glow' : ''}`} />
        
        {/* Avatar */}
        <div className={`relative w-32 h-32 ${isAnimated ? 'animate-float' : ''}`}>
          {/* Head */}
          <div className="relative w-full h-full">
            {/* Helmet */}
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 rounded-full border-4 border-blue-400 relative overflow-hidden">
              {/* Visor */}
              <div className="absolute inset-2 bg-gradient-to-br from-blue-400/80 to-purple-600/80 rounded-full" />
              
              {/* Reflection on visor */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full blur-sm" />
              
              {/* Face visible through visor */}
              <div className="absolute inset-4 flex items-center justify-center">
                {/* Eyes */}
                <div className="flex gap-2">
                  <div className={`w-2 h-2 bg-yellow-400 rounded-full ${isSpeaking ? 'animate-pulse' : ''}`} />
                  <div className={`w-2 h-2 bg-yellow-400 rounded-full ${isSpeaking ? 'animate-pulse' : ''}`} />
                </div>
              </div>
            </div>
            
            {/* Antenna */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-silver">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Sound waves when speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-40 h-40 border-2 border-blue-400/30 rounded-full animate-ping`}
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Speech Bubble */}
      <div className="mt-4 relative">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
          <p className={`text-white text-sm ${isSpeaking ? 'animate-pulse' : ''}`}>
            {currentMessage}
          </p>
        </div>
        {/* Speech bubble pointer */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/10 border-l border-t border-blue-400/30 rotate-45" />
      </div>

      {/* Controls */}
      <div className="flex justify-center mt-4">
        <Button
          onClick={toggleSpeech}
          size="sm"
          variant="outline"
          className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isSpeaking ? 'Stop' : 'Speak'}
        </Button>
      </div>
    </Card>
  );
};
