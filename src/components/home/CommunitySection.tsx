
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Code, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => {
  return (
    <div className="p-6 glassmorphism rounded-xl transition-all duration-300 hover-scale subtle-shadow">
      <div className="mb-4 p-3 bg-background/80 rounded-lg w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const CommunitySection = () => {
  const features = [
    {
      icon: <Users size={24} className="text-jungle" />,
      title: "Collaborative Community",
      description: "Connect with like-minded builders, share ideas, and collaborate on projects through our vibrant community platform."
    },
    {
      icon: <Code size={24} className="text-coral" />,
      title: "Continuous Learning",
      description: "Discover new tools, techniques, and skills through regular mini-hackathons and community-led workshops."
    },
    {
      icon: <PenTool size={24} className="text-cambridge" />,
      title: "Build Your Portfolio",
      description: "Showcase your projects, receive feedback, and build a comprehensive portfolio of your work as you grow."
    },
    {
      icon: <MessageSquare size={24} className="text-khaki" />,
      title: "Community Support",
      description: "Get help, feedback, and encouragement from a supportive community that values continuous improvement."
    },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-jungle/10 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 rounded-full bg-coral/10 blur-[80px] animate-pulse-slow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community of Builders</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Just Keep Building is more than a platform—it's a community of continuous creators 
            who support each other in learning, building, and growing together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild size="lg" className="bg-jungle hover:bg-jungle/90">
            <Link to="/community">
              Join Our Community
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
