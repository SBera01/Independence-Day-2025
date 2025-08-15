import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import './CurtainOpening.module.css';

interface CurtainOpeningProps {
  onComplete: () => void;
}

export const CurtainOpening = ({ onComplete }: CurtainOpeningProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000); // Increased duration for balloon animations
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Fixed position tricolor stripes with balloons
  const stripes = [
    { id: 1, color: '#FF9933', top: 0 },    // Saffron
    { id: 2, color: '#FFFFFF', top: 33.33 }, // White
    { id: 3, color: '#138808', top: 66.66 }  // Green
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] opacity-10" />
      
      {/* Tricolor Stripes with Balloons */}
      <div className="fixed left-0 top-0 bottom-0 w-24 flex flex-col">
        {stripes.map((stripe) => (
          <div
            key={stripe.id}
            className="flex-1 relative overflow-hidden stripe-container"
            style={{ backgroundColor: stripe.color }}
          >
            {/* Decorative balloons for each stripe */}
            <div 
              className="balloon fixed-balloon"
              style={{ 
                backgroundColor: stripe.color,
                boxShadow: `0 0 10px ${stripe.color}`,
              }}
            />
            <div 
              className="balloon fixed-balloon"
              style={{ 
                backgroundColor: stripe.color,
                boxShadow: `0 0 10px ${stripe.color}`,
                top: '60%',
                left: '60%',
                animationDelay: '0.3s'
              }}
            />
          </div>
        ))}
      </div>

      {/* Hero Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-merriweather text-gradient mb-4 animate-title-slide-up"
            style={{ animationDelay: '1.5s' }}
          >
            Happy Independence Day
          </h1>
          <h2 
            className="text-3xl md:text-5xl lg:text-6xl font-bold font-merriweather text-primary animate-year-fade-in opacity-0"
            style={{ animationDelay: '2s' }}
          >
            2025
          </h2>
          <div 
            className="mt-8 text-lg text-muted-foreground font-poppins animate-subtitle-slide-up opacity-0"
            style={{ animationDelay: '2.5s' }}
          >
            Celebrating 78 years of freedom
          </div>
        </div>
      </div>

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