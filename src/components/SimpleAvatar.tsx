
import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SimpleAvatarProps {
  isAnimated?: boolean;
}

export const SimpleAvatar = ({ isAnimated = false }: SimpleAvatarProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  // Simple messages for the avatar
  const messages = [
    "Hi there! I'm Captain Cosmos, and I'll teach you about satellites today!",
    "Satellites are cool machines that fly around Earth in space!",
    "They help us with GPS, weather, and talking to people far away!",
    "Let's build our own satellite together!",
    "Ready to become a space engineer?"
  ];

  // Basic text-to-speech function
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop any current speech
      
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.8;
      speech.pitch = 1.0;
      
      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => {
        setIsSpeaking(false);
        // Go to next message after 2 seconds
        setTimeout(() => {
          setMessageIndex(prev => (prev + 1) % messages.length);
        }, 2000);
      };
      
      window.speechSynthesis.speak(speech);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakMessage(messages[messageIndex]);
    }
  };

  // Update the message when index changes
  useEffect(() => {
    setCurrentMessage(messages[messageIndex]);
  }, [messageIndex]);

  // Auto-start speaking when animated
  useEffect(() => {
    if (isAnimated && !isSpeaking) {
      const timer = setTimeout(() => {
        speakMessage(messages[messageIndex]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAnimated, messageIndex]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-blue-400">
      {/* Avatar display area */}
      <div className="h-48 flex items-center justify-center mb-4">
        {/* Simple avatar design */}
        <div className={`relative ${isAnimated ? 'animate-bounce' : ''}`}>
          {/* Helmet */}
          <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-blue-400 relative">
            {/* Visor */}
            <div className="absolute inset-2 bg-blue-500 rounded-full opacity-80" />
            
            {/* Simple face inside helmet */}
            <div className="absolute inset-6 flex items-center justify-center">
              {/* Eyes that blink when speaking */}
              <div className="flex gap-1">
                <div className={`w-1 h-1 bg-yellow-400 rounded-full ${isSpeaking ? 'animate-ping' : ''}`} />
                <div className={`w-1 h-1 bg-yellow-400 rounded-full ${isSpeaking ? 'animate-ping' : ''}`} />
              </div>
            </div>
          </div>
          
          {/* Simple antenna */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400">
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Sound waves when speaking - simple version */}
        {isSpeaking && (
          <div className="absolute flex items-center justify-center">
            <div className="w-32 h-32 border border-blue-400 rounded-full animate-ping opacity-30" />
            <div className="w-40 h-40 border border-blue-400 rounded-full animate-ping opacity-20" />
          </div>
        )}
      </div>

      {/* Message bubble */}
      <div className="relative mb-4">
        <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
          <p className={`text-white text-sm ${isSpeaking ? 'text-blue-300' : ''}`}>
            {currentMessage}
          </p>
        </div>
        {/* Simple speech bubble arrow */}
        <div className="absolute -top-1 left-6 w-2 h-2 bg-gray-700 border-l border-t border-gray-600 transform rotate-45" />
      </div>

      {/* Simple control button */}
      <div className="text-center">
        <button
          onClick={toggleSpeech}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto"
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isSpeaking ? 'Stop' : 'Speak'}
        </button>
      </div>
    </div>
  );
};
