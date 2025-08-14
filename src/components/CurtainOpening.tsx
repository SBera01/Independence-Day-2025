import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CurtainOpeningProps {
  onComplete: () => void;
}

export const CurtainOpening = ({ onComplete }: CurtainOpeningProps) => {
  const [showCurtains, setShowCurtains] = useState(true);
  const [showHero, setShowHero] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    // Curtains slide out after 500ms
    const curtainTimer = setTimeout(() => {
      setShowCurtains(false);
    }, 500);

    // Hero appears after curtains finish (1.7s total)
    const heroTimer = setTimeout(() => {
      setShowHero(true);
    }, 1700);

    // Balloons and fireworks start after hero zoom (2.2s)
    const effectsTimer = setTimeout(() => {
      setShowBalloons(true);
      setShowFireworks(true);
    }, 2200);

    // Complete the sequence (5s total)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(curtainTimer);
      clearTimeout(heroTimer);
      clearTimeout(effectsTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const balloons = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 200,
    color: i % 3 === 0 ? 'saffron' : i % 3 === 1 ? 'primary' : 'success',
    left: 10 + (i * 10) + Math.random() * 10,
  }));

  const fireworks = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 150,
    top: 20 + Math.random() * 40,
    left: 10 + Math.random() * 80,
    color: i % 3 === 0 ? 'hsl(var(--saffron))' : i % 3 === 1 ? 'hsl(var(--ashoka-blue))' : 'hsl(var(--success))',
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Curtains */}
      {showCurtains && (
        <>
          <div className="absolute inset-0 left-0 w-1/2 bg-ashoka-blue animate-curtain-left transform-gpu" />
          <div className="absolute inset-0 right-0 w-1/2 bg-ashoka-blue animate-curtain-right transform-gpu" />
        </>
      )}

      {/* Background */}
      <div className="absolute inset-0 bg-subtle" />

      {/* Hero Text */}
      {showHero && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-hero-zoom">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-merriweather text-gradient mb-4">
              Happy Independence Day
            </h1>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-merriweather text-primary">
              2025
            </h2>
            <div className="mt-8 text-lg text-muted-foreground font-poppins">
              Celebrating 78 years of freedom
            </div>
          </div>
        </div>
      )}

      {/* Floating Balloons */}
      {showBalloons && (
        <div className="absolute inset-0 pointer-events-none">
          {balloons.map((balloon) => (
            <div
              key={balloon.id}
              className={`absolute bottom-0 w-8 h-10 rounded-full animate-balloon`}
              style={{
                left: `${balloon.left}%`,
                animationDelay: `${balloon.delay}ms`,
                backgroundColor: `hsl(var(--${balloon.color}))`,
              }}
            />
          ))}
        </div>
      )}

      {/* Fireworks */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {fireworks.map((firework) => (
            <div
              key={firework.id}
              className="firework"
              style={{
                top: `${firework.top}%`,
                left: `${firework.left}%`,
                backgroundColor: firework.color,
                animationDelay: `${firework.delay}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Skip button for accessibility */}
      <Button
        variant="outline"
        size="sm"
        onClick={onComplete}
        className="absolute top-4 right-4 glass-card border-white/20 text-white hover:bg-white/10"
      >
        Skip Animation
      </Button>
    </div>
  );
};