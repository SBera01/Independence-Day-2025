import { useState, useEffect } from 'react';
import { CurtainOpening } from '@/components/CurtainOpening';
import { MainCards } from '@/components/MainCards';
import { FreedomFighters } from '@/components/FreedomFighters';
import { ImageGenerator } from '@/components/ImageGenerator';

type Page = 'opening' | 'main' | 'fighters' | 'generator';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('opening');
  const [hasReducedMotion, setHasReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setHasReducedMotion(mediaQuery.matches);

    // Skip opening animation if reduced motion is preferred
    if (mediaQuery.matches) {
      setCurrentPage('main');
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setHasReducedMotion(e.matches);
      if (e.matches && currentPage === 'opening') {
        setCurrentPage('main');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentPage]);

  const handleOpeningComplete = () => {
    setCurrentPage('main');
  };

  const handleNavigate = (page: 'fighters' | 'generator') => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('main');
  };

  return (
    <>
      {currentPage === 'opening' && !hasReducedMotion && (
        <CurtainOpening onComplete={handleOpeningComplete} />
      )}
      
      {currentPage === 'main' && (
        <MainCards onNavigate={handleNavigate} />
      )}
      
      {currentPage === 'fighters' && (
        <FreedomFighters onBack={handleBack} />
      )}
      
      {currentPage === 'generator' && (
        <ImageGenerator onBack={handleBack} />
      )}
    </>
  );
};

export default Index;
