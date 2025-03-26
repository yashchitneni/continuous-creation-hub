
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="w-full py-20 px-4 sm:px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-jungle/5"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-jungle/20 via-coral/5 to-background"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="glassmorphism rounded-2xl p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            Ready to Start Building?
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            Join our community today and embark on a journey of continuous creation, 
            collaboration, and growth. Your next great project is waiting to be built.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-jungle hover:bg-jungle/90">
              <Link to="/register">
                Create Your Account <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline">
              <Link to="/showcase">
                Browse Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
