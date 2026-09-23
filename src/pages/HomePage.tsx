import React from 'react';
import { Hero } from '../components/Hero';
import { NewDropSection } from '../components/NewDropSection';
import { DropCountdown } from '../components/DropCountdown';
import { CategoryGrid } from '../components/CategoryGrid';
import { TrendingCarousel } from '../components/TrendingCarousel';
import { RecentlyViewedSection } from '../components/RecentlyViewedSection';
import { HiddenGemsSection } from '../components/HiddenGemsSection';
import { ChromeDinoFeature } from '../components/ChromeDinoFeature';
import { StreetwearSection } from '../components/StreetwearSection';
import { AroundTheWorldSection } from '../components/AroundTheWorldSection';
import { AndroidTechSection } from '../components/AndroidTechSection';
import { SustainableSection } from '../components/SustainableSection';
import { CompleteYourLook } from '../components/CompleteYourLook';
import { VibeSelector } from '../components/VibeSelector';
import { LimitedDropBanner } from '../components/LimitedDropBanner';
import { LoyaltyBanner } from '../components/LoyaltyBanner';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      <Hero />
      <NewDropSection />
      <DropCountdown />
      <LoyaltyBanner />
      <CategoryGrid />
      <TrendingCarousel />
      <RecentlyViewedSection />
      <HiddenGemsSection />
      <ChromeDinoFeature />
      <StreetwearSection />
      <AroundTheWorldSection />
      <AndroidTechSection />
      <SustainableSection />
      <CompleteYourLook />
      <VibeSelector />
      <LimitedDropBanner />
    </div>
  );
};
