
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Radio, Microscope, Rocket, CheckCircle } from 'lucide-react';

interface SatelliteBuilderProps {
  onComplete: () => void;
}

interface Component {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  installed: boolean;
  x: number;
  y: number;
}

export const SatelliteBuilder = ({ onComplete }: SatelliteBuilderProps) => {
  const [components, setComponents] = useState<Component[]>([
    {
      id: 'solar-panel',
      name: 'Solar Panels',
      icon: <Zap className="w-6 h-6" />,
      description: 'Converts sunlight into electrical power',
      installed: false,
      x: 50,
      y: 20
    },
    {
      id: 'antenna',
      name: 'Communication Antenna',
      icon: <Radio className="w-6 h-6" />,
      description: 'Sends and receives signals to Earth',
      installed: false,
      x: 50,
      y: 80
    },
    {
      id: 'instruments',
      name: 'Scientific Instruments',
      icon: <Microscope className="w-6 h-6" />,
      description: 'Collects data and performs experiments',
      installed: false,
      x: 20,
      y: 50
    },
    {
      id: 'thruster',
      name: 'Attitude Thrusters',
      icon: <Rocket className="w-6 h-6" />,
      description: 'Controls satellite orientation and position',
      installed: false,
      x: 80,
      y: 50
    }
  ]);

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [buildStep, setBuildStep] = useState(0);
  const [showTest, setShowTest] = useState(false);

  const installComponent = (componentId: string) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === componentId 
          ? { ...comp, installed: true }
          : comp
      )
    );
    
    setBuildStep(prev => prev + 1);
    setSelectedComponent(null);

    // Check if all components are installed
    const allInstalled = components.every(comp => 
      comp.id === componentId || comp.installed
    );
    
    if (allInstalled) {
      setTimeout(() => setShowTest(true), 1000);
    }
  };

  const testSatellite = () => {
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const progress = (buildStep / components.length) * 100;
  const allComponentsInstalled = components.every(comp => comp.installed);

  return (
    <Card className="p-6 bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Satellite Assembly Station</h2>
        <p className="text-gray-300">Click on components to install them on your satellite</p>
        <div className="mt-4">
          <Progress value={progress} className="h-2 bg-gray-800" />
          <p className="text-sm text-gray-400 mt-1">{buildStep}/{components.length} components installed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satellite Visualization */}
        <div className="relative">
          <Card className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500/30 p-4">
            <div className="relative w-full h-full">
              {/* Central satellite body */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg border-2 border-blue-400/50">
                <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold">
                  SAT-1
                </div>
              </div>

              {/* Component positions */}
              {components.map((component) => (
                <div
                  key={component.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                    component.installed ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
                  }`}
                  style={{ left: `${component.x}%`, top: `${component.y}%` }}
                >
                  <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
                    component.installed 
                      ? 'bg-green-600 border-green-400 animate-pulse-glow' 
                      : 'bg-gray-600 border-gray-400'
                  }`}>
                    {component.installed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      component.icon
                    )}
                  </div>
                </div>
              ))}

              {/* Orbital path indicator */}
              <div className="absolute inset-0 border-2 border-dashed border-blue-400/30 rounded-full animate-spin" style={{ animation: 'spin 20s linear infinite' }} />
            </div>
          </Card>

          {showTest && (
            <div className="mt-4 text-center">
              <Button
                onClick={testSatellite}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-full animate-pulse-glow"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Launch Test
              </Button>
            </div>
          )}
        </div>

        {/* Component Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Available Components</h3>
          {components.map((component) => (
            <Card
              key={component.id}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                component.installed
                  ? 'bg-green-900/30 border-green-500/50'
                  : selectedComponent === component.id
                  ? 'bg-blue-900/30 border-blue-500/50 scale-105'
                  : 'bg-gray-800/30 border-gray-600/50 hover:border-blue-400/50 hover:bg-blue-900/20'
              }`}
              onClick={() => !component.installed && setSelectedComponent(component.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  component.installed 
                    ? 'bg-green-600' 
                    : selectedComponent === component.id 
                    ? 'bg-blue-600' 
                    : 'bg-gray-600'
                }`}>
                  {component.installed ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    component.icon
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{component.name}</h4>
                    {component.installed && (
                      <Badge className="bg-green-600 text-white">Installed</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{component.description}</p>
                  {selectedComponent === component.id && !component.installed && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        installComponent(component.id);
                      }}
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      Install Component
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {allComponentsInstalled && !showTest && (
        <div className="mt-6 text-center">
          <div className="text-green-400 mb-2">
            <CheckCircle className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-green-400 font-semibold">
            Excellent work! Your satellite is fully assembled. Ready for testing!
          </p>
        </div>
      )}
    </Card>
  );
};
