import { Card, CardContent } from '@/components/ui/card';
import { Users, ImageIcon } from 'lucide-react';

interface MainCardsProps {
  onNavigate: (page: 'fighters' | 'generator') => void;
}

export const MainCards = ({ onNavigate }: MainCardsProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-subtle">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-merriweather text-gradient mb-4">
            Independence Day 2025
          </h1>
          <p className="text-lg text-muted-foreground font-poppins">
            Honor our heroes and create patriotic memories
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Whom You Like Card */}
          <Card 
            className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group border-0 p-8"
            style={{
              boxShadow: 'rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px'
            }}
            onClick={() => onNavigate('fighters')}
          >
            <CardContent className="text-center space-y-6 p-0">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-merriweather text-primary mb-3">
                  Whom You Like
                </h2>
                <p className="text-muted-foreground font-poppins">
                  Pay tribute to India's greatest freedom fighters and heroes who sacrificed everything for our independence
                </p>
              </div>
              <div className="inline-flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                Explore Heroes →
              </div>
            </CardContent>
          </Card>

          {/* Generate Image Card */}
          <Card 
            className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group border-0 p-8"
            style={{
              boxShadow: 'rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px'
            }}
            onClick={() => onNavigate('generator')}
          >
            <CardContent className="text-center space-y-6 p-0">
              <div className="w-20 h-20 mx-auto bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <ImageIcon className="w-10 h-10 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-merriweather text-secondary mb-3">
                  Generate Image
                </h2>
                <p className="text-muted-foreground font-poppins">
                  Create beautiful patriotic images with your name and photo to celebrate Independence Day
                </p>
              </div>
              <div className="inline-flex items-center text-secondary font-medium group-hover:translate-x-2 transition-transform">
                Create Images →
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <span className="w-2 h-2 bg-saffron rounded-full"></span>
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="w-2 h-2 bg-success rounded-full"></span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground font-poppins">
            Jai Hind! 🇮🇳
          </p>
        </div>
      </div>
    </div>
  );
};