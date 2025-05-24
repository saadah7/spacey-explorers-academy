
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WebcamFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsActive(true);
      setError('');
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    // Auto-start webcam when component mounts
    startWebcam();

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="overflow-hidden bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Your Space Station</h3>
          <Button
            onClick={isActive ? stopWebcam : startWebcam}
            size="sm"
            variant="outline"
            className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
          >
            {isActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-500/30">
          {isActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay frame */}
              <div className="absolute inset-0 border-4 border-blue-400/50 rounded-lg pointer-events-none">
                <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-blue-400" />
                <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-blue-400" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-blue-400" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-blue-400" />
              </div>
              {/* Status indicator */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">LIVE</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {error ? (
                <div className="text-center text-red-400">
                  <CameraOff className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Camera not active</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-400 mt-2 text-center">
          Wave to Captain Cosmos! 👋
        </p>
      </div>
    </Card>
  );
};
