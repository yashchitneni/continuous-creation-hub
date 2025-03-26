
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-card/50 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-jungle to-cambridge flex items-center justify-center">
                <span className="text-white font-bold text-sm">JKB</span>
              </div>
              <span className="font-bold text-lg text-foreground">
                Just Keep Building
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A community platform for continuous learning, collaboration, and innovation 
              through mini-hackathons and project showcases.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-jungle transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-jungle transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-jungle transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2 - Links */}
          <div className="space-y-6">
            <h4 className="font-medium text-foreground">Quick Links</h4>
            <div className="space-y-3">
              <Link to="/showcase" className="block text-sm text-muted-foreground hover:text-jungle transition-colors">
                Hack Showcase
              </Link>
              <Link to="/hackathons" className="block text-sm text-muted-foreground hover:text-jungle transition-colors">
                Hackathons
              </Link>
              <Link to="/tools" className="block text-sm text-muted-foreground hover:text-jungle transition-colors">
                Tool Discovery
              </Link>
              <Link to="/community" className="block text-sm text-muted-foreground hover:text-jungle transition-colors">
                Community Forum
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-jungle transition-colors">
                About Us
              </Link>
            </div>
          </div>

          {/* Column 3 - Resources */}
          <div className="space-y-6">
            <h4 className="font-medium text-foreground">Resources</h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-muted-foreground hover:text-jungle transition-colors">
                How It Works
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-jungle transition-colors">
                Submission Guidelines
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-jungle transition-colors">
                Voting System
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-jungle transition-colors">
                Co-Working Sessions
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-jungle transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="space-y-6">
            <h4 className="font-medium text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest hackathons and community updates.
            </p>
            <div className="flex items-center space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-muted border-none h-10"
              />
              <Button size="sm" className="h-10 bg-jungle hover:bg-jungle/80">
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} Just Keep Building. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-jungle transition-colors">Terms</a>
            <a href="#" className="hover:text-jungle transition-colors">Privacy</a>
            <a href="#" className="hover:text-jungle transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
