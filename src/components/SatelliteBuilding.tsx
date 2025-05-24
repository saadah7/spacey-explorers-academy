
import { useState } from 'react';
import { Zap, Radio, Microscope, Rocket, CheckCircle } from 'lucide-react';

interface SatelliteBuilding {
  onComplete: () => void;
}

export const SatelliteBuilding = ({ onComplete }: SatelliteBuilding) => {
  // Track which parts are installed
  const [installedParts, setInstalledParts] = useState<string[]>([]);
  const [selectedPart, setSelectedPart] = useState('');
  const [showTest, setShowTest] = useState(false);

  // Satellite parts data
  const parts = [
    {
      id: 'solar',
      name: 'Solar Panels',
      icon: <Zap className="w-5 h-5" />,
      description: 'Gives power to the satellite from sunlight'
    },
    {
      id: 'antenna',
      name: 'Antenna',
      icon: <Radio className="w-5 h-5" />,
      description: 'Talks to Earth and receives commands'
    },
    {
      id: 'camera',
      name: 'Camera',
      icon: <Microscope className="w-5 h-5" />,
      description: 'Takes pictures and does science experiments'
    },
    {
      id: 'thruster',
      name: 'Thrusters',
      icon: <Rocket className="w-5 h-5" />,
      description: 'Helps the satellite point in the right direction'
    }
  ];

  // Install a part
  const installPart = (partId: string) => {
    if (!installedParts.includes(partId)) {
      const newInstalled = [...installedParts, partId];
      setInstalledParts(newInstalled);
      setSelectedPart('');
      
      // Show test button when all parts are installed
      if (newInstalled.length === parts.length) {
        setTimeout(() => setShowTest(true), 500);
      }
    }
  };

  // Test the satellite
  const testSatellite = () => {
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const progress = (installedParts.length / parts.length) * 100;

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-blue-400">
      <h2 className="text-white text-xl font-bold mb-2">Build Your Satellite</h2>
      <p className="text-gray-300 mb-4">Click on parts to add them to your satellite</p>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm mt-1">{installedParts.length}/{parts.length} parts installed</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Satellite visualization - simple version */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
          <div className="relative h-64 flex items-center justify-center">
            {/* Main satellite body */}
            <div className="w-16 h-16 bg-gray-400 rounded border-2 border-blue-400 flex items-center justify-center">
              <span className="text-blue-400 text-xs font-bold">SAT</span>
            </div>

            {/* Solar panels */}
            {installedParts.includes('solar') && (
              <>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-12 bg-blue-900 border border-blue-400 rounded opacity-80" />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-12 bg-blue-900 border border-blue-400 rounded opacity-80" />
              </>
            )}

            {/* Antenna */}
            {installedParts.includes('antenna') && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-600 border border-blue-400 rounded-full flex items-center justify-center">
                <Radio className="w-4 h-4 text-blue-400" />
              </div>
            )}

            {/* Camera */}
            {installedParts.includes('camera') && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 border border-blue-400 rounded flex items-center justify-center">
                <Microscope className="w-3 h-3 text-blue-400" />
              </div>
            )}

            {/* Thrusters */}
            {installedParts.includes('thruster') && (
              <>
                <div className="absolute left-8 bottom-8 w-4 h-4 bg-orange-500 border border-orange-400 rounded-full opacity-75" />
                <div className="absolute right-8 bottom-8 w-4 h-4 bg-orange-500 border border-orange-400 rounded-full opacity-75" />
              </>
            )}

            {/* Simple orbit indicator */}
            <div className="absolute inset-0 border border-dashed border-blue-400 rounded-full opacity-30 animate-spin" style={{ animation: 'spin 10s linear infinite' }} />
          </div>

          {/* Test button */}
          {showTest && (
            <div className="text-center mt-4">
              <button
                onClick={testSatellite}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full flex items-center gap-2 mx-auto animate-pulse"
              >
                <Rocket className="w-4 h-4" />
                Test Launch!
              </button>
            </div>
          )}
        </div>

        {/* Parts list */}
        <div className="space-y-3">
          <h3 className="text-white font-bold">Satellite Parts</h3>
          {parts.map((part) => {
            const isInstalled = installedParts.includes(part.id);
            const isSelected = selectedPart === part.id;
            
            return (
              <div
                key={part.id}
                className={`p-3 rounded border cursor-pointer transition-all ${
                  isInstalled 
                    ? 'bg-green-800 border-green-600' 
                    : isSelected
                    ? 'bg-blue-800 border-blue-600'
                    : 'bg-gray-700 border-gray-600 hover:border-blue-500'
                }`}
                onClick={() => !isInstalled && setSelectedPart(part.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${
                    isInstalled ? 'bg-green-600' : isSelected ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {isInstalled ? <CheckCircle className="w-5 h-5 text-white" /> : part.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{part.name}</h4>
                    <p className="text-gray-300 text-sm">{part.description}</p>
                    {isSelected && !isInstalled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          installPart(part.id);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mt-2"
                      >
                        Install Part
                      </button>
                    )}
                    {isInstalled && (
                      <span className="text-green-400 text-sm">✓ Installed</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {installedParts.length === parts.length && !showTest && (
        <div className="mt-4 text-center">
          <div className="text-green-400 mb-2">
            <CheckCircle className="w-6 h-6 mx-auto" />
          </div>
          <p className="text-green-400">Great job! Your satellite is ready for testing!</p>
        </div>
      )}
    </div>
  );
};
