
import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';

export const BasicWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOn, setIsOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState('');

  // Start the webcam
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsOn(true);
      setError('');
    } catch (err) {
      console.log('Camera error:', err);
      setError('Could not access camera');
    }
  };

  // Stop the webcam
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsOn(false);
  };

  // Auto start camera when component loads
  useEffect(() => {
    startCamera();
    
    // Cleanup when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-blue-400">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-bold">Your Space Station</h3>
        <button
          onClick={isOn ? stopCamera : startCamera}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          {isOn ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="bg-gray-900 rounded border-2 border-blue-500" style={{ aspectRatio: '16/9' }}>
        {isOn ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded"
            />
            {/* Simple corner decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-blue-400" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-blue-400" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-blue-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-blue-400" />
            
            {/* Live indicator */}
            <div className="absolute top-2 right-8 flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-xs bg-black bg-opacity-50 px-1 rounded">LIVE</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {error ? (
              <div className="text-center text-red-400">
                <CameraOff className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Camera is off</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <p className="text-gray-400 text-xs text-center mt-2">
        Say hi to Captain Cosmos! 👋
      </p>
    </div>
  );
};
