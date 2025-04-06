
import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrentYear } from '@/hooks/use-current-year';

const Footer = () => {
  const currentYear = useCurrentYear();
  
  return (
    <footer className="bg-card/50 border-t">
      <div className="container px-6 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Hackistan</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              A community of builders learning and creating together through mini-hackathons.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Resources</h3>
            <div className="mt-4 space-y-2">
              <Link to="/resources/how-it-works" className="block text-sm text-muted-foreground hover:text-foreground">
                How It Works
              </Link>
              <Link to="/resources/submission-guidelines" className="block text-sm text-muted-foreground hover:text-foreground">
                Submission Guidelines
              </Link>
              <Link to="/resources/voting-system" className="block text-sm text-muted-foreground hover:text-foreground">
                Voting System
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Community</h3>
            <div className="mt-4 space-y-2">
              <Link to="/showcase" className="block text-sm text-muted-foreground hover:text-foreground">
                Project Showcase
              </Link>
              <Link to="/hackathons" className="block text-sm text-muted-foreground hover:text-foreground">
                Hackathons
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground">
                About Us
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Legal</h3>
            <div className="mt-4 space-y-2">
              <Link to="/terms" className="block text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="block text-sm text-muted-foreground hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-muted-foreground/20">
          <p className="text-sm text-center text-muted-foreground">
            &copy; {currentYear} Hackistan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
