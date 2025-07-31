'use client';
import React from 'react';
import { 
  HeroSection, 
  FeaturesSection, 
  StatsSection, 
  CompaniesSection, 
  CTASection, 
  Footer 
} from './sections';

export const LandingPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-background'>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CompaniesSection />
      <CTASection />
      <Footer />
    </div>
  );
};
