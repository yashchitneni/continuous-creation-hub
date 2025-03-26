
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import TrendingSection from '@/components/home/TrendingSection';
import UpcomingHackathons from '@/components/home/UpcomingHackathons';
import CommunitySection from '@/components/home/CommunitySection';
import TestimonialSection from '@/components/home/TestimonialSection';
import CtaSection from '@/components/home/CtaSection';

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturedSection />
      <TrendingSection />
      <UpcomingHackathons />
      <CommunitySection />
      <TestimonialSection />
      <CtaSection />
    </PageLayout>
  );
};

export default Index;
