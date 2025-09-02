import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { subscribeToVotes, castVote, syncLocalVotesToFirebase } from '@/lib/firestore';

interface Fighter {
  id: string;
  name: string;
  image: string;
  description: string;
  contribution: string;
}

interface FreedomFightersProps {
  onBack: () => void;
}

export const FreedomFighters = ({ onBack }: FreedomFightersProps) => {
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Freedom fighters data
  const fighters: Fighter[] = [
    {
      id: 'gandhi',
      name: 'Mahatma Gandhi',
      image: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Portrait_Gandhi.jpg',
      description: 'Father of the Nation',
      contribution: 'Led India to independence through non-violent civil disobedience'
    },
    {
      id: 'bhagat-singh',
      name: 'Bhagat Singh',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Bhagat_Singh_1929.jpg',
      description: 'Revolutionary Freedom Fighter',
      contribution: 'Sacrificed his life at 23 for independence, inspiring countless youth'
    },
    {
      id: 'subhas-bose',
      name: 'Subhas Chandra Bose',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Subhas_Chandra_Bose_NRB.jpg',
      description: 'Netaji',
      contribution: 'Founded the Indian National Army and fought for complete independence'
    },
    {
      id: 'sardar-patel',
      name: 'Sardar Vallabhbhai Patel',
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Sardar_patel_%28cropped%29.jpg',
      description: 'Iron Man of India',
      contribution: 'United 562 princely states into the Indian Union'
    },
    {
      id: 'nehru',
      name: 'Jawaharlal Nehru',
      image: 'https://i.pinimg.com/736x/94/25/0f/94250f1c7e01df1911b028ec0656e3f0.jpg',
      description: 'First Prime Minister',
      contribution: 'Led the independence movement and shaped modern India'
    },
    {
      id: 'rani-lakshmibai',
      name: 'Rani Lakshmibai',
      image: 'https://sawanonlinebookstore.com/wp-content/uploads/2022/05/jhansi-ki-rani-laxmibai.jpg',
      description: 'Queen of Jhansi',
      contribution: 'Fought valiantly against British rule in the 1857 revolt'
    },
    {
      id: 'lal-bahadur',
      name: 'Lal Bahadur Shastri',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrPh8SORZtBZZDU3u7YE_uzl_Q5RTlCsQ_RQ&s',
      description: 'Second Prime Minister',
      contribution: 'Promoted the White Revolution and Green Revolution'
    },
    {
      id: 'tilak',
      name: 'Bal Gangadhar Tilak',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-MLq9-kqjyeHtQp58oe-aORG6kjt0Eqddtd6t1ZtlElWOU0-zLrJbV01I47IBxci6Urw&usqp=CAU',
      description: 'Lokmanya',
      contribution: 'First leader to demand complete independence (Swaraj is my birthright)'
    },
    {
      id: 'annie-besant',
      name: 'Annie Besant',
      image: 'https://madrascourier.com/wp-content/uploads/2017/08/Annie-Besant-Madras-Courier-01.jpg',
      description: 'Home Rule Movement Leader',
      contribution: 'Advocated for Indian self-governance and women\'s rights'
    },
    {
      id: 'lala-lajpat',
      name: 'Lala Lajpat Rai',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSvYfZRpdPuLo0VpXWCKVJZXIRd1Z4sFC5wg&s',
      description: 'Punjab Kesari',
      contribution: 'Led protests against British policies and partition of Bengal'
    },
    {
      id: 'azad-maulana',
      name: 'Maulana Abul Kalam Azad',
      image: 'https://www.constitutionofindia.net/wp-content/uploads/2022/09/Maulana-Abul-Kalam-Azad.jpg',
      description: 'First Education Minister',
      contribution: 'Promoted education and communal harmony in independent India'
    },
    {
      id: 'sarojini-naidu',
      name: 'Sarojini Naidu',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrmaIAAf6EUJBvKe2JKrBS7prtst7UXHkjCmcdWybPZ81sGI6zuxr1zQ2EQq7RV5D9Yo8An2M9w4kLsMmCkHwaBp3Y4JglzE9qF6CUTzoi0HDpzjSi4jPEBj0gG5KIgYBOWpyPWm8Rj_RL/s0/Portrait+of+Sarojini+Naidu+-+Bombay+1946.jpg',
      description: 'Nightingale of India',
      contribution: 'Poet, politician, and first woman governor of India'
    },
    {
      id: 'chandrashekhar-azad',
      name: 'Chandrashekhar Azad',
      image: 'https://cdn.britannica.com/40/274440-050-4EC6EAAB/Portrait-Of-Indian-Freedom-Fighter-Chandra-Shekhar-Azad.jpg',
      description: 'Revolutionary Leader',
      contribution: 'Led the Hindustan Republican Association and never surrendered'
    },
    {
      id: 'khan-ghaffar',
      name: 'Khan Abdul Ghaffar Khan',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Khan_Abdul_Ghaffar_Khan.jpg',
      description: 'Frontier Gandhi',
      contribution: 'Non-violent independence activist from the frontier province'
    },
    {
      id: 'alluri-raju',
      name: 'Alluri Sitarama Raju',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShlmlLv7m9dFguC0uIA7o7oeMM_FCGRW7vW8tJIULH7uiUUDn6_j3OKBURkj8jyPpVuGM&usqp=CAU',
      description: 'Revolutionary of Andhra Pradesh',
      contribution: 'Led the Rampa Rebellion against British colonial rule'
    },
    {
      id: 'kasturba-gandhi',
      name: 'Kasturba Gandhi',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Kasturba_Gandhi_1940.jpg/250px-Kasturba_Gandhi_1940.jpg',
      description: 'Freedom Fighter',
      contribution: 'Participated in independence movement alongside Mahatma Gandhi'
    },
    {
      id: 'bharati',
      name: 'Subramania Bharati',
      image: 'https://madrascourier.com/wp-content/uploads/2019/03/Subramanya-Bharathi-Madras-Courier-07.jpg',
      description: 'Tamil Poet and Freedom Fighter',
      contribution: 'Used poetry to inspire freedom movement and social reform'
    },
    {
      id: 'kumaran',
      name: 'Tiruppur Kumaran',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4eu6Gl08Yo28Pjt5E2AyikWVnilThme9vxw&s',
      description: 'Revolutionary of Tamil Nadu',
      contribution: 'Died holding the Indian flag during protests against British rule'
    },
    {
      id: 'bipin-pal',
      name: 'Bipin Chandra Pal',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNGGDpzmZKyC1sGGNdlM5yeoEam6drjKki0g&s',
      description: 'Extremist Leader',
      contribution: 'Part of Lal-Bal-Pal trio, advocated for complete independence'
    },
    {
      id: 'ashfaqulla',
      name: 'Ashfaqulla Khan',
      image: 'https://vault.drishticuet.com/english_file_uploads/1729690572_image9jpeg.jpg',
      description: 'Revolutionary Freedom Fighter',
      contribution: 'Close associate of Ram Prasad Bismil, executed for the Kakori conspiracy'
    }
  ];

  // Load votes from Firebase with real-time updates
  useEffect(() => {
    // First, sync any existing localStorage votes to Firebase
    syncLocalVotesToFirebase();
    
    // Set up real-time listener for votes
    const unsubscribe = subscribeToVotes((firebaseVotes) => {
      setVotes(firebaseVotes);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Save votes to localStorage
  const saveVotes = (newVotes: Record<string, number>) => {
    localStorage.setItem('independenceday-votes', JSON.stringify(newVotes));
    setVotes(newVotes);
  };

  const handleVote = async (fighterId: string) => {
    if (isLoading) return; // Prevent double-clicking
    
    setIsLoading(true);
    
    try {
      const success = await castVote(fighterId);
      
      if (success) {
        toast.success('Thank you for your tribute! 🇮🇳', {
          description: 'Your vote has been counted and synced to the database.',
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)',
            color: '#000',
            border: '2px solid #ff9933',
            borderRadius: '12px',
            fontWeight: '600',
            boxShadow: '0 8px 32px rgba(255, 153, 51, 0.3)'
          },
          className: 'toast-success-custom'
        });
      } else {
        toast.success('Thank you for your tribute! 🇮🇳', {
          description: 'Your vote has been saved locally and will sync when online.',
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)',
            color: '#000',
            border: '2px solid #ff9933',
            borderRadius: '12px',
            fontWeight: '600',
            boxShadow: '0 8px 32px rgba(255, 153, 51, 0.3)'
          },
          className: 'toast-success-custom'
        });
      }
    } catch (error) {
      toast.error('Failed to cast vote', {
        description: 'Please try again later.',
        duration: 3000,
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          border: '2px solid #fca5a5',
          borderRadius: '12px',
          fontWeight: '600',
          boxShadow: '0 8px 32px rgba(220, 38, 38, 0.2)'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (fighter: Fighter) => {
    setSelectedFighter(fighter);
  };

  return (
    <div className="min-h-screen bg-subtle p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="glass-card border-primary/20 hover:bg-primary/10 bg-"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-merriweather text-gradient">
              Freedom Fighters Gallery
            </h1>
            <p className="text-muted-foreground mt-2">
              Honor the heroes who gave us independence
            </p>
          </div>
        </div>

        {/* Fighters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {fighters.map((fighter) => (
            <Card
              key={fighter.id}
              className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group border-0"
              onClick={() => handleCardClick(fighter)}
            >
              <CardContent className="p-4 text-center">
                <img
                  src={fighter.image}
                  alt={fighter.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-primary/20"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fighter.name)}&background=0B4DA2&color=fff&size=80`;
                  }}
                />
                <h3 className="font-semibold text-sm mb-1 text-primary">
                  {fighter.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {fighter.description}
                </p>
                <div className="flex items-center justify-center text-xs text-success">
                  <Heart className="w-3 h-3 mr-1" />
                  {votes[fighter.id] || 0} votes
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fighter Modal */}
      <Dialog open={!!selectedFighter} onOpenChange={() => setSelectedFighter(null)}>
        <DialogContent className="glass-card border-primary/20 max-w-md bg-card text-card-foreground shadow-lg">
          {selectedFighter && (
            <>
              <DialogTitle className="sr-only">
                {selectedFighter.name} - Freedom Fighter Details
              </DialogTitle>
              <div className="text-center space-y-4 p-2">
                <img
                  src={selectedFighter.image}
                  alt={selectedFighter.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/20 shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedFighter.name)}&background=0B4DA2&color=fff&size=128`;
                  }}
                />
                <div>
                  <h2 className="text-2xl font-bold font-merriweather text-primary mb-2">
                    Salute to {selectedFighter.name}
                  </h2>
                  <p className="text-lg font-semibold text-secondary mb-2">
                    Jai Hind! 🇮🇳
                  </p>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {selectedFighter.contribution}
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <div className="text-center bg-secondary/10 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold text-success">
                      {votes[selectedFighter.id] || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Selected by people
                    </div>
                  </div>
                  <Button
                    onClick={() => handleVote(selectedFighter.id)}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary-glow disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {isLoading ? 'Casting Vote...' : 'Pay Tribute'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};