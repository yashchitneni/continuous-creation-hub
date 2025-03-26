
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Bell, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Showcase', path: '/showcase' },
    { name: 'Hackathons', path: '/hackathons' },
    { name: 'Tools', path: '/tools' },
    { name: 'Community', path: '/community' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-10',
        isScrolled ? 'glassmorphism' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-jungle to-cambridge flex items-center justify-center">
            <span className="text-white font-bold text-sm">JKB</span>
          </div>
          <span className="font-bold text-lg hidden sm:block text-foreground">
            Just Keep Building
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-jungle relative',
                isActive(link.path)
                  ? 'text-jungle after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-jungle'
                  : 'text-foreground/90'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-foreground/90 hover:text-jungle transition-colors p-1">
            <Search size={18} />
          </button>
          <button className="text-foreground/90 hover:text-jungle transition-colors p-1 relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-coral rounded-full"></span>
          </button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-muted hover:bg-muted/80 text-foreground"
            asChild
          >
            <Link to="/profile">
              <User size={16} className="mr-2" />
              <span>Profile</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground/90 hover:text-jungle transition-colors"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={cn(
            'fixed inset-0 bg-background/95 backdrop-blur-lg z-40 md:hidden transition-all duration-300',
            mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          )}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-6 py-20">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-xl font-medium transition-colors hover:text-jungle',
                  isActive(link.path) ? 'text-jungle' : 'text-foreground/90'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-6 mt-8">
              <button className="text-foreground/90 hover:text-jungle transition-colors p-2">
                <Search size={20} />
              </button>
              <button className="text-foreground/90 hover:text-jungle transition-colors p-2 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-coral rounded-full"></span>
              </button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-muted hover:bg-muted/80 text-foreground"
                asChild
              >
                <Link to="/profile">
                  <User size={18} className="mr-2" />
                  <span>Profile</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
