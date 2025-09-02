import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import './CurtainOpening.module.css';

interface CurtainOpeningProps {
  onComplete: () => void;
}

export const CurtainOpening = ({ onComplete }: CurtainOpeningProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phases = [
      1000,  // Phase 0: Initial fade in
      2000,  // Phase 1: Flag animation
      3500,  // Phase 2: Text appears
      5500,  // Phase 3: Final celebration
      6500   // Complete
    ];

    const timeouts: NodeJS.Timeout[] = [];
    
    phases.forEach((delay, index) => {
      const timeout = setTimeout(() => {
        if (index < phases.length - 1) {
          setPhase(index + 1);
        } else {
          onComplete();
        }
      }, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-b from-orange-400 via-white to-green-600">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Dynamic gradient background */}
        <div className={`absolute inset-0 transition-all duration-2000 ${
          phase >= 1 
            ? 'bg-gradient-to-br from-orange-500 via-white to-green-600 opacity-80' 
            : 'bg-transparent'
        }`} />
        
        {/* Particle System */}
        {phase >= 1 && (
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `sparkle 3s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Flag Animation */}
      <div className={`absolute inset-0 transition-all duration-1000 z-10 ${
        phase >= 1 ? 'opacity-100' : 'opacity-90'
      }`}>
        {/* Tricolor Flag Reveal */}
        <div className="absolute inset-0 flex flex-col">
          {/* Saffron */}
          <div className={`flex-1 bg-gradient-to-r from-orange-400 to-orange-500 transform transition-all duration-1000 ${
            phase >= 1 ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-300/50 to-orange-600/80" />
          </div>
          
          {/* White with Ashoka Chakra */}
          <div className={`flex-1 bg-white relative transform transition-all duration-1000 border-y-2 border-gray-200 ${
            phase >= 1 ? 'translate-x-0' : '-translate-x-full'
          }`} style={{ animationDelay: '0.3s' }}>
            {/* Ashoka Chakra */}
            {phase >= 2 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Outer circle with spokes */}
                  <div className="w-24 h-24 relative animate-spin" style={{ animation: 'spin 8s linear infinite' }}>
                    {/* 24 spokes */}
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-10 bg-blue-700 left-1/2 top-1/2 origin-bottom"
                        style={{
                          transform: `translateX(-50%) translateY(-100%) rotate(${i * 15}deg)`,
                        }}
                      />
                    ))}
                    {/* Center circle */}
                    <div className="absolute inset-0 border-4 border-blue-700 rounded-full" />
                    <div className="absolute inset-2 border-2 border-blue-700 rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Green */}
          <div className={`flex-1 bg-green-600 transform transition-all duration-1000 ${
            phase >= 1 ? 'translate-y-0' : 'translate-y-full'
          }`} style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0" style={{ backgroundColor: '#16a34a' }} />
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-transparent z-20">
        <div className="text-center z-10">
          {/* Main Title */}
          <div className={`transform transition-all duration-1000 ${
            phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold font-serif text-white mb-4 tracking-wide">
              <span className="inline-block transform transition-all duration-700 hover:scale-105" 
                    style={{ animationDelay: '0.1s' }}>
                हैप्पी
              </span>
              <br />
              <span className="inline-block transform transition-all duration-700 hover:scale-105"
                    style={{ animationDelay: '0.3s' }}>
                <span className="text-orange-400">INDEPENDENCE</span>
              </span>
              <br />
              <span className="inline-block transform transition-all duration-700 hover:scale-105"
                    style={{ animationDelay: '0.5s' }}>
                <span className="text-grey-400" style={{ color: '#d3ded3' }}>DAY</span>
              </span>
            </h1>
          </div>

          {/* Year */}
          <div className={`transform transition-all duration-1000 ${
            phase >= 3 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`} style={{ transitionDelay: '0.5s' }}>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-green mb-6">
              2025
            </h2>
          </div>

          {/* Subtitle */}
          <div className={`transform transition-all duration-1000 ${
            phase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ transitionDelay: '0.8s' }}>
            <p className="text-xl md:text-2xl text-white/90 font-light tracking-widest mb-2">
              🇮🇳 JAI HIND 🇮🇳
            </p>
            <p className="text-lg md:text-xl text-white/70 font-light">
              Celebrating 79 Years of Freedom
            </p>
          </div>

          {/* Celebration Elements */}
          {phase >= 3 && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Confetti particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animation: `sparkle 2s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  {i % 3 === 0 ? '🎉' : i % 3 === 1 ? '🎊' : '✨'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skip Button - Elegant */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onComplete}
        className="absolute top-8 right-8 text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-300 z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        Skip Animation →
      </Button>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-3 px-4 py-2 rounded-full backdrop-blur-md border border-white/20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                phase > i ? 'bg-white shadow-lg' : 'bg-white/40'
              }`}
              style={{
                boxShadow: phase > i ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};