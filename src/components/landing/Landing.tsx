'use client';
import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { StatsSection } from './sections/StatsSection';
import { CompaniesSection } from './sections/CompaniesSection';
import { CTASection } from './sections/CTASection';
import { Footer } from './sections/Footer';

export const Landing: React.FC = () => {
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
