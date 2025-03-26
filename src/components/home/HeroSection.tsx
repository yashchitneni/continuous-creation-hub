
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-jungle/20 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-coral/10 blur-[80px] animate-pulse-slow"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 sm:px-6 flex flex-col items-center text-center">
        <div className="animate-slide-down">
          <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-muted text-foreground mb-6">
            The Community for Continuous Creators
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl mx-auto mb-6 text-balance animate-slide-down">
          <span className="text-gradient">Build</span>, learn and grow with our community
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-down">
          Join mini-hackathons, showcase your projects, collaborate with others, and discover new tools 
          in a community that celebrates continuous creation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <Button asChild size="lg" className="bg-jungle hover:bg-jungle/90">
            <Link to="/hackathons">
              Join a Hackathon <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link to="/showcase">
              Explore Projects
            </Link>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-20 animate-slide-up">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-gradient mb-2">238+</span>
            <span className="text-sm text-muted-foreground">Completed Hacks</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-gradient mb-2">16K+</span>
            <span className="text-sm text-muted-foreground">Community Members</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-gradient mb-2">40+</span>
            <span className="text-sm text-muted-foreground">Mini-Hackathons</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-gradient mb-2">120+</span>
            <span className="text-sm text-muted-foreground">Tools Discovered</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
